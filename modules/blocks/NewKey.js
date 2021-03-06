/**
 iZ³ | Izzzio blockchain - https://izzz.io
 @author: Andrey Nedobylsky (admin@twister-vl.ru)
 */


const Signable = require('../../../modules/blocks/signable');
const CryptoJS = require("crypto-js");
let type = 'NewKey';

/**
 * NewKey block
 * @type {Signable}
 */
class NewKey extends Signable {
    /**
     * @param {String} owner
     * @param {String} ownerPubKey
     */
    constructor(owner, ownerPubKey) {
        super();
        this.type = type;
        this.owner = owner;
        this.publicKey = ownerPubKey;
        this.generateData();
    }

    /**
     * Создаёт строку данных для подписи
     */
    generateData() {
        this.data = this.type + CryptoJS.SHA256(this.owner + this.publicKey);
    }


}

module.exports = NewKey;