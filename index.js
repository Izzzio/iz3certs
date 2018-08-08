/**
 iZ³ | Izzzio blockchain - https://izzz.io
 @author: Andrey Nedobylsky (admin@twister-vl.ru)
 EDUCERT - blockchain certificates checker
 */

const logger = new (require('../modules/logger'))("EDU");

let DApp = require('../app/DApp');
let NewKey = require('./modules/blocks/NewKey');
let Document = require('./modules/blocks/Document');

class App extends DApp {
    init() {
        let that = this;
        this.certificationKeys = {};
        this.certificationKeysArr = [];

        require('./modules/splash')();

        if(this.getBlockHandler().isKeyFromKeyring(this.getCurrentWallet().keysPair.public)) {
            logger.warning('ADMINISTRATOR KEY');
        }

        /**
         * Хендлер ключей сертефикации
         */
        this.registerBlockHandler("NewKey", function (blockData, block, cb) {
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
         * Перезагружаем цепочку блоков для получения инфомрации о всех ключах.
         */
        this.getBlockHandler().playBlockchain(0, function () {
            logger.info('Certification keys loaded: ' + that.certificationKeysArr.length + ' keys.');
            that.ready(); //Инициализировались
        });


        /*  this.registerMessageHandler('WriteCandyData', function (message) {
              console.log('New message: ');
              console.log(message);

              let newBlock = new NewKey(JSON.stringify(message.data));



              //that.blockchain.broadcastMessage('Hello', 'newData', message.recepient, message.recepient, 0);

              return false;
          });*/

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

        if(typeof this.certificationKeys[signedBlock.issuer] === 'undefined' || this.certificationKeys[signedBlock.issuer] !== signedBlock.pubkey) {
            logger.error('Invalid issuer key');
            cb();
            return false;
        }

        if(!this.getBlockHandler().isKeyFromKeyring(this.getCurrentWallet().keysPair.public)) {
            logger.error('Current wallet does not represent in keyring');
            cb();
            return false;
        }

        if(!this.isKeyFromCertificationKeys(signedBlock.pubkey)) {
            logger.error('Provided key dos not represent in certification keys list');
            cb();
            return false;
        }

        this.generateAndAddBlock(signedBlock, function blockGenerated(generatedBlock) {
            logger.info('New certificate deployed');
            cb(generatedBlock);
        });

        return true;

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
        let that = this;
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
}

module.exports = App;