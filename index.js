/**
 iZ³ | Izzzio blockchain - https://izzz.io
 @author: Andrey Nedobylsky (admin@twister-vl.ru)
 EDUCERT - blockchain certificates checker
 */

let DApp = require('../app/DApp');
let NewKey = require('./modules/blocks/NewKey');

class App extends DApp {
    init() {
        let that = this;

        require('./modules/splash')();

        setTimeout(function () {

            let newBlock = new NewKey('Skolkovo', '1234');

            that.generateAndAddBlock(newBlock, function blockGenerated(generatedBlock) {
                console.log('New block');
                console.log(generatedBlock);
            });


        }, 30000);


        /*  this.registerMessageHandler('WriteCandyData', function (message) {
              console.log('New message: ');
              console.log(message);

              let newBlock = new NewKey(JSON.stringify(message.data));

              that.generateAndAddBlock(newBlock, function blockGenerated(generatedBlock) {
                  console.log('New block');
                  console.log(generatedBlock);
                  that.blockchain.broadcastMessage(generatedBlock, 'newData', message.recepient, message.recepient, 0);
              });

              //that.blockchain.broadcastMessage('Hello', 'newData', message.recepient, message.recepient, 0);

              return false;
          });*/

    }
}

module.exports = App;