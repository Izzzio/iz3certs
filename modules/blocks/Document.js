/**
 iZ³ | Izzzio blockchain - https://izzz.io
 @author: Andrey Nedobylsky (admin@twister-vl.ru)
 */


const Signable = require('../../../modules/blocks/signable');
const CryptoJS = require("crypto-js");
let type = 'Document';

/**
 * Document issue block
 * @type {Signable}
 */
class Document extends Signable {
    /**
     * @param {String} issuer
     * @param {String} hash
     */
    constructor(issuer, hash) {
        super();
        this.type = type;
        this.issuer = issuer;
        this.hash = hash;
        this.generateData();
    }

    /**
     * Создаёт строку данных для подписи
     */
    generateData() {
        this.data = this.type + CryptoJS.SHA256(this.issuer + this.hash);
    }


}

module.exports = Document;