/**
 * iZ³ Documents checker
 */

/**
 * @var {Candy} candy
 */
let candy;

let connectionTimeoutTimer;

/**
 * Инициализация
 */
function init() {
    showModalLoading();
    $('#r5').datepicker({
        format: "dd/mm/yyyy",
        todayBtn: "linked",
        clearBtn: true,
        language: "ru",
        autoclose: true,
        todayHighlight: true,
        toggleActive: true
    });

    for (let i in DOCUMENTS_TYPES) {
        if(DOCUMENTS_TYPES.hasOwnProperty(i)) {
            $('#r4').append($('<option>', {
                value: i,
                text: DOCUMENTS_TYPES[i]
            }));
        }
    }

    for (let i in ISSUERS) {
        if(ISSUERS.hasOwnProperty(i)) {
            $('#r6').append($('<option>', {
                value: i,
                text: ISSUERS[i]
            }));
        }
    }

    candy = new Candy(nodes).start();
    candy.onready = function () {
        setInterval(function () {
            if(candy.getActiveConnections().length === 0) {
                showModalLoading();
            }
            candy.broadcastMessage({}, 'iz3certsCheckConnection', candy.recieverAddress, candy.recieverAddress);

        }, 2000);

        setTimeout(function () {
            if(window.location.hash.indexOf('dcid:') !== -1) {
                let dcid = window.location.hash.split('dcid:')[1];
                checkByDCID(dcid);
            }
        }, 2000);
    };

    candy.onmessage = function (message) {
        processInputMessage(message);
    };


    /**
     * Обновление отображения DCID
     */
    setInterval(function () {
        let newDcid = getDCID('#documentCheck');
        if($('#dcidShow').text() !== newDcid) {
            $('#dcidShow').text(newDcid);
        }

        $('#blockchainInfo').text('Connections: ' + candy.getActiveConnections().length + ' Height: ' + candy.blockHeight + '')
    }, 200);


    /**
     * Вохврат на изначальную форму
     */
    $('#backButton').click(function () {
        $('#checkResult').hide();
        $('#checkForm').show();
        window.location.hash = '';
    });

    /**
     * Выполнение проверки по документу
     */
    $('#documentCheck').submit(function (e) {
        checkByDCID(getDCID('#documentCheck'));
        e.preventDefault();
    });

    /**
     * Выполнение проверки по DCID
     */
    $('#doCheckDCID').click(function () {
        checkByDCID($('#dcid').val());
    });

    /**
     * Проверка и начало использования публичного ключа
     */
    $('#doAcceptKey').click(function () {

        function showError() {
            alert('Некорректная пара ключей. Проверьте правильность ввода ключей.');
            $('#doAddDocument').hide();
            $('.hideOnDataAdding').show();
        }

        try {
            let privateKey = $('#privateKey').val().trim() + "\n";
            let publicKey = $('#publicKey').val().trim() + "\n";
            let signCheck = new DigitalSignature();
            let signedData = signCheck.signData('test', privateKey);
            if(signCheck.verifyData('test', signedData.sign, publicKey)) {
                $('#privateKey').val(privateKey);
                $('#publicKey').val(publicKey);
                candy.broadcastMessage({key: publicKey}, 'iz3certsGetKeyIssuer', candy.recieverAddress, candy.recieverAddress);
            } else {
                showError();
            }
        } catch (e) {
            showError();
        }

    });

    /**
     * Добавление документа
     */
    $('#doAddDocument').click(function () {
        if($('#r1').val().trim().length === 0) {
            alert('Фамилия - обязательный параметр');
            return false;
        }

        if($('#r2').val().trim().length === 0) {
            alert('Имя - обязательный параметр');
            return false;
        }

        if(confirm('Вы действительно хотите добавить документ? Проверьте все поля, обратить это действие будет невозможно!')) {
            if(confirm('Помните, что обратить это действие - невозможно. Выполнить добавление?')) {
                addNewDocument(getDCID('#documentCheck'));
            }
        }
    });

    document.onkeydown = function (e) {
        if(e.key === 'F2') {
            $('#doLoadKey').show();
        }
    };

    if(window.location.hash === '#doLoadKey') {
        $('#doLoadKey').show();
    }


}

/**
 * Прячет модальное окно загрузки
 */
function hideModalLoading() {
    $('#loadingModal').modal('hide');
}

/**
 * Показывает модальное окно загрузки
 */
function showModalLoading() {
    $('#loadingModal').modal({backdrop: 'static', 'keyboard': false});
}

/**
 * Перемешивает строку, используя эту-же строку как основание для перемешивания
 * @param str
 * @return {string}
 */
function shuffleSelfBased(str) {
    return str.split('').sort(function (i, z) {
        return (i.charCodeAt(0) < 100 || i.charCodeAt(0) > 200) && z.charCodeAt(0)
    }).join('');
}


/**
 * Собирает данные формы в формат, готовый для хеширования
 * @param formSelector
 */
function collectDocumentData(formSelector) {
    let form = $(formSelector);
    let hash = '';
    hash += form.find('#r1').val().trim() + '|';
    hash += form.find('#r2').val().trim() + '|';
    hash += form.find('#r3').val().trim() + '|';
    hash += form.find('#r4').val().trim();
    hash += form.find('#r5').val().trim();
    hash += form.find('#r6').val().trim();
    hash += form.find('#r7').val().trim();
    hash += form.find('#r8').val().trim();
    hash = hash.toLowerCase(hash);


    return (hash);
}

/**
 * Генерирует DCID для формы
 * @param formSelector
 */
function getDCID(formSelector) {
    let data = collectDocumentData(formSelector);
    data = shuffleSelfBased(data);
    let md = forge.md.sha256.create();
    md.update(data);
    return md.digest().toHex();
}

/**
 * Обрабатывает входящие сообщения
 * @param message
 */
function processInputMessage(message) {

    switch (message.id) {
        case "iz3certsCheckConnectionOk": //Проверка наличия подключения к необходимому приложению
            hideModalLoading();
            clearTimeout(connectionTimeoutTimer);
            connectionTimeoutTimer = setTimeout(function () {
                showModalLoading();
            }, 3000);
            break;
        case "iz3certsCheckDocumentResult":
            showCheckDocumentResult(message.data);
            break;
        case "iz3certsGetKeyIssuerOk":
            if(!message.data) {
                alert('Пара ключей корректна, однако не найдена в базе данных.')
            } else {
                $('#issuer').val(message.data);
                setTimeout(function () {
                    $('#loadKey').modal('hide');
                    $('.hideOnDataAdding').hide();
                    $('#doLoadKey').hide();
                    $('#doAddDocument').show();
                }, 1000);
            }
            break;
        case "iz3certsAddNewDocumentOk":
            if(!message.data) {
                alert('Ошибка добавления документа в реестр');
            } else {
                let document = JSON.parse(message.data.data);
                document.index = message.data.index;
                showCheckDocumentResult(document);
                $('#resultStatus').addClass('ok').text('Документ добавлен в распределённый реестр');
            }
            break;
    }
}

/**
 * Отобразить результаты проверки
 */
function showCheckDocumentResult(result) {
    $('#checkResult').show();
    $('#checkForm').hide();
    $('#resultDcid').val('');
    $('#resultIssuer').val('');
    $('#resultSign').val('');
    $('#resultIndex').val('');
    $('#resultPubkey').val('');
    $('#resultStatus').removeClass('error').removeClass('ok');


    if(result) {
        $('#resultDcid').val(result.hash);
        $('#resultIssuer').val(result.issuer);
        $('#resultSign').val(result.sign);
        $('#resultIndex').val(result.index);
        $('#resultPubkey').val(result.pubkey);

        window.location.hash = 'dcid:' + result.hash;

        let signCheck = new DigitalSignature();
        if(signCheck.verifyData(result.data, result.sign, result.pubkey)) {
            $('#resultSignCheck').val('Корректна');
            $('#resultStatus').addClass('ok').text('Документ присутствует в распределеном реестре');
            $('#resultsExplain').text('Документ найден в реестре. Цифровая подпись корректна.');

        } else {
            $('#resultSignCheck').val('НЕКОРРЕКТНА');
            $('#resultStatus').addClass('error').text('Документ присутствует в распределеном реестре, но цифровая подпись некоректна');
            $('#resultsExplain').text('Документ найден в реестре, однако цифровая подпись некорректна. Возможно цифровая подпись была подделана, или произошла другая ошибка верефикации. Используйте другие способы проверки документа.');
        }
    } else {
        $('#resultStatus').addClass('error').text('Документ отсутствует в распределеном реестре');
        $('#resultsExplain').text('Отсутствие документа в распределенном реестре может означать, что документ ещё не был добавлен в реестр, или не был найден документ, соответствующий введеным данным. Проверьте правильность ввода или воспользуйтесь альтернативными способами проверки.');
    }
}

/**
 * Запускает проверку документа по dcid хешу
 * @param {string} dcid
 * @return {boolean}
 */
function checkByDCID(dcid) {
    return candy.broadcastMessage({hash: dcid}, 'iz3certsCheckDocument', candy.recieverAddress, candy.recieverAddress);
}

/**
 * Добавление докуменда в БД
 * @param dcid
 */
function addNewDocument(dcid) {
    let issuer = $('#issuer').val();
    let block = createSignableDocumentBlock(dcid, issuer);
    block = signBlock(block);

    candy.broadcastMessage({block: block}, 'iz3certsAddNewDocument', candy.recieverAddress, candy.recieverAddress);
}


/**
 * Подпись блока
 * @param block
 * @return {*}
 */
function signBlock(block) {
    let privateKey = $('#privateKey').val();
    let publicKey = $('#publicKey').val();
    let signCheck = new DigitalSignature();

    block.sign = signCheck.signData(block.data, privateKey).sign;
    block.pubkey = publicKey;

    return block;
}

/**
 * Создаёт блок документа, готовый для подписи
 * @param hash
 * @param issuer
 */
function createSignableDocumentBlock(hash, issuer) {

    let block = {
        type: 'Document',
        issuer: issuer,
        hash: hash,
        pubkey: '',
        sign: ''
    };

    let md = forge.md.sha256.create();
    md.update(block.issuer + block.hash);
    block.data = block.type + md.digest().toHex();

    return block;

}


init();