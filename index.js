/**
 iZ³ | Izzzio blockchain - https://izzz.io
 @author: Andrey Nedobylsky (admin@twister-vl.ru)
 EDUCERT - blockchain certificates checker
 */

const logger = new (require('../modules/logger'))("EDU");

const DApp = require('../app/DApp');
const KeyValue = require('../modules/keyvalue');
const NewKey = require('./modules/blocks/NewKey');
const Document = require('./modules/blocks/Document');


let that;

/**
 * EDU DApp
 */
class App extends DApp {

    /**
     * Initialize
     */
    init() {
        that = this;
        this.certificationKeys = {};
        this.certificationKeysArr = [];
        this.documents = new KeyValue('documents');

        require('./modules/splash')();

        if(this.getBlockHandler().isKeyFromKeyring(this.getCurrentWallet().keysPair.public)) {
            logger.warning('ADMINISTRATOR KEY');
        }

        /**
         * Хендлер ключей сертефикации
         */
        this.blocks.handler.registerHandler("NewKey", function (blockData, block, cb) {
            try {
                if(that.getCurrentWallet().verifyData(blockData.data, blockData.sign, blockData.pubkey) && that.getBlockHandler().isKeyFromKeyring(blockData.pubkey)) {
                    if(typeof that.certificationKeys[blockData.owner] !== 'undefined') {
                        logger.error('Certification key duplicate for owner: ' + blockData.owner + ' in block ' + block.index);
                    } else {
                        that.certificationKeys[blockData.owner] = blockData.publicKey;
                        that.certificationKeysArr.push(blockData.publicKey);
                    }
                } else {
                    logger.error('Invalid certification key in block ' + block.index);
                }
            } catch (e) {
                if(that.getConfig().program.verbose) {
                    console.log(e);
                } else {
                    logger.error('Invalid certification key or other error in block ' + block.index);
                }
            }

            cb();
        });

        /**
         * Хендлер документов
         */
        this.blocks.handler.registerHandler("Document", function (blockData, block, cb) {
            /**
             * @var {Document} blockData
             */
            try {
                if(that.getCurrentWallet().verifyData(blockData.data, blockData.sign, blockData.pubkey) && that.isKeyFromCertificationKeys(blockData.pubkey)) {
                    blockData.index = block.index;
                    that.documents.put(blockData.hash, JSON.stringify(blockData), function () {
                        return cb();
                    });

                } else {
                    logger.error('Invalid certification key in block ' + block.index);
                    return cb();
                }
            } catch (e) {
                if(that.getConfig().program.verbose) {
                    console.log(e);
                } else {
                    logger.error('Invalid certification key or other error in block ' + block.index);
                    return cb();
                }
            }


        });

        /**
         * Перезагружаем цепочку блоков для получения инфомрации о всех ключах.
         */
        this.getBlockHandler().playBlockchain(0, function () {
            logger.info('Certification keys loaded: ' + that.certificationKeysArr.length + ' keys.');
            that.ready(); //Инициализировались
        });


        /**
         * Проверка наличия документа в базе
         */
        this.registerMessageHandler('iz3certsCheckDocument', function (message) {
            that.getDocumentInfo(message.data.hash, function (document) {
                that.messaging.sendMessage(message._socket, document, 'iz3certsCheckDocumentResult', message.recepient);
            });

            return false;
        });

        this.registerMessageHandler('iz3certsCheckConnection', function (message) {
            that.messaging.sendMessage(message._socket, 'OK', 'iz3certsCheckConnectionOk', message.recepient);
        });

        /**
         * Получение информации о владельце ключа
         */
        this.registerMessageHandler('iz3certsGetKeyIssuer', function (message) {
            for (let a in that.certificationKeys) {
                if(that.certificationKeys.hasOwnProperty(a)) {
                    if(that.certificationKeys[a] === message.data.key) {
                        that.messaging.sendMessage(message._socket, a, 'iz3certsGetKeyIssuerOk', message.recepient);
                        return;
                    }
                }
            }
            that.messaging.sendMessage(message._socket, false, 'iz3certsGetKeyIssuerOk', message.recepient);
        });

        this.registerMessageHandler('iz3certsAddNewDocument', function (message) {
            let signedBlock = message.data.block;
            that.addSignedDocument(signedBlock, function (document) {
                if(!document) {
                    document = false;
                }

                setTimeout(function () {
                    that.messaging.sendMessage(message._socket, document, 'iz3certsAddNewDocumentOk', message.recepient);
                }, 1000);

            });
        });

    }


    /**
     * Добавляет новый сертификационный ключ, подписывая его текущим кошельком
     * @param owner
     * @param publicKey
     * @param cb
     */
    addNewCertificationKey(owner, publicKey, cb) {

        if(typeof cb !== 'function') {
            cb = function () {
            }
        }

        if(!this.getBlockHandler().isKeyFromKeyring(this.getCurrentWallet().keysPair.public)) {
            logger.error('Current wallet does not represent in keyring');
            cb();
            return false;
        }

        let newBlock = new NewKey(owner, publicKey);
        newBlock = this.getCurrentWallet().signBlock(newBlock);
        this.generateAndAddBlock(newBlock, function blockGenerated(generatedBlock) {
            logger.info('New certification key created and deployed');
            cb(generatedBlock);
        });

        return true;
    }

    /**
     * Add signed document block to chain
     * @param {Document} signedBlock
     * @param {Function} cb
     */
    addSignedDocument(signedBlock, cb) {

        if(typeof cb !== 'function') {
            cb = function () {
            }
        }

        that.getDocumentInfo(signedBlock.hash, function (document) {
            if(document) {
                logger.error('Document already deployed');
                cb();
                return false;
            }

            if(typeof that.certificationKeys[signedBlock.issuer] === 'undefined' || that.certificationKeys[signedBlock.issuer] !== signedBlock.pubkey) {
                logger.error('Invalid issuer key');
                cb();
                return false;
            }

            if(!that.getBlockHandler().isKeyFromKeyring(that.getCurrentWallet().keysPair.public)) {
                logger.error('Current wallet does not represent in keyring');
                cb();
                return false;
            }

            if(!that.isKeyFromCertificationKeys(signedBlock.pubkey)) {
                logger.error('Provided key dos not represent in certification keys list');
                cb();
                return false;
            }

            that.generateAndAddBlock(signedBlock, function blockGenerated(generatedBlock) {
                logger.info('New certificate deployed');
                cb(generatedBlock);
            });
        });


        return true;

    }

    /**
     * Получение информации о документе по хешу
     * @param hash
     * @param cb
     */
    getDocumentInfo(hash, cb) {
        this.documents.get(hash, function (err, document) {
            if(!err) {
                return cb(JSON.parse(document.toString()));
            }

            cb(false);
        })
    }

    /**
     * Проверяем есть ли таой ключ в цепочке разрешенных к выпуску
     * @param key
     * @return {boolean}
     */
    isKeyFromCertificationKeys(key) {
        return this.certificationKeysArr.indexOf(key) !== -1;
    }

    /**
     * Инициализация завершена
     */
    ready() {

        logger.info('EDU ready');

        /*setTimeout(function () {
            let document = new Document('Test Org', 'balabalabala');
            document = that.getCurrentWallet().signBlock(document);
            that.addSignedDocument(document, function (block) {
                if(block) {
                    logger.info('Document deploed');
                } else {
                    logger.error('Document deploing error')
                }
            })
        }, 5000);*/
    }

    /**
     * Завершение работы
     * @param cb
     */
    terminate(cb) {
        logger.info('Terminate...');
        this.documents.close(cb);
    }
}

module.exports = App;