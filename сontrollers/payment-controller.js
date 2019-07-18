let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let path = require('path');
const paymentsPath = path.join(__dirname, '../public', 'upload', 'payments');
let upload = require('../middleware/file-midlleware')(paymentsPath);
let ObjectHelper = require('../helpers/object-helper');
let xl = require('excel4node');
const writtenNumber = require('written-number');

upload = upload.array('files');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.payment.findById(
            req.params.id,
            {
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        res.json(models);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'number.$like')) {
            query.q.number.$like = `%${query.q.number.$like}%`
        }


        let newIncludes = [];
        if (query.include.length > 0) {
            for (let includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let innerInclude = null;
                let required = false;
                if (_.has(query.q, 'application.id') && includeTableName === 'application') {
                    includeWhere = {
                        id: query.q.application.id
                    };
                    required = true;
                }

                if (includeTableName === 'application>client') {
                    innerInclude = null;
                    let clientInclude = {model: db.client};
                    if (_.has(query.q, 'client.fullname')) {
                        let where = {
                            $or: [
                                {
                                    name: {
                                        $like: `%${query.q.client.fullname}%`
                                    }
                                },
                                {
                                    surname: {
                                        $like: `%${query.q.client.fullname}%`
                                    }
                                }
                            ]
                        };
                        clientInclude.where = where;
                        delete query.q.client;
                    }
                    innerInclude = clientInclude;
                    includeTableName = 'application';
                }

                if (includeTableName === 'application>course') {
                    innerInclude = null;
                    let courseInclude = {model: db.course};
                    if (_.has(query.q, 'course.name')) {
                        let where = {
                            name: {
                                $like: `%${query.q.course.name}%`
                            }
                        };
                        courseInclude.where = where;
                        delete query.q.course;
                    }
                    innerInclude = courseInclude;
                    includeTableName = 'application';
                }

                let alreadyExistsInclude = newIncludes.find(i => i.model === db[includeTableName]);
                if (alreadyExistsInclude) {
                    if (alreadyExistsInclude.include) {
                        alreadyExistsInclude.include.push(innerInclude);
                    } else {
                        alreadyExistsInclude.include = [innerInclude];
                    }
                } else {
                    include = {
                        model: db[includeTableName],
                        required,
                        where: includeWhere,
                    };
                    if (innerInclude) {
                        include.include = [innerInclude];
                    }
                    newIncludes.push(include);
                }
                if (query.q[includeTableName])
                    delete query.q[includeTableName];
            }
        }
        query.include = newIncludes;

        let models = await db.payment.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        let count = await db.payment.count(
            {
                where: query.q,
                include: query.include,
            }
        );

        res.json({
            models,
            count
        });
    } catch (e) {
        console.log(e);
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.payment.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.payment.requiredFileds, 400, 'Payment controller'));
        }
        let model = await db.payment.create(req.body);
        let application = await model.getApplication();
        application.leftToPay -= model.amount ? model.amount : 0;
        await application.save();
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};

controller.remove = async function (req, res, next) {
    try {
        let paymentToDestroy = await db.payment.findById(req.params.id);
        let application = await paymentToDestroy.getApplication();
        application.leftToPay += paymentToDestroy.amount;
        await application.save();
        await paymentToDestroy.destroy();
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'))
    }
};

controller.update = async (req, res, next) => {
    let transaction;
    try {
        ObjectHelper.clean(req.body, db.payment.notUpdatableFields);
        let id = req.params.id;
        let model = await db.payment.findById(id);
        if (model) {
            if (req.body.amount && req.body.amount !== model.amount) {
                let application = await model.getApplication();
                const amountDifference = req.body.amount - (model.amount ? model.amount : 0);
                application.leftToPay = application.leftToPay - amountDifference;
                transaction = await db.sequelize.transaction();
                await application.save({transaction});
                await model.update(req.body, {transaction});
                await transaction.commit();
                res.status(201).json(await model.update(req.body));
            } else {
                res.status(201).json(await model.update(req.body));
            }
        } else {
            next(new ControllerError('Model not found', 400, 'Payment controller'))
        }
    } catch (e) {
        if (transaction) {
            await transaction.rollback();
        }
        next(new ControllerError(e.message, 400, 'Payment controller'))
    }
};

controller.upload = async function (req, res, next) {
    let paymentId = req.params.id;

    try {
        if (await db.payment.findByPk(paymentId)) {
            upload(req, res, async function (err) {
                if (err) {
                    return next(new ControllerError(err.message, 400, 'Payment controller'));
                } else {
                    try {
                        let paymentFiles = [];
                        if (req.files && req.files.length > 0) {
                            for (let file in req.files) {
                                try {
                                    let paymentFile = await db.file.create({
                                        path: path.join('payments', req.files[file].filename),
                                        paymentId
                                    });
                                    paymentFiles.push(paymentFile);
                                } catch (e) {
                                    e.status = 400;
                                    return next(e);
                                }
                            }
                        }
                        return res.json(paymentFiles);
                    } catch (e) {
                        return next(new ControllerError(e.message, 400, 'Payment controller'));
                    }
                }
            });
        } else {
            return next(new ControllerError('Payment not found', 400, 'Client controller'));
        }
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};

controller.createFile = async function (req, res, next) {
    let paymentId = req.params.id;
    const paymentFiles = [];
    const dateNow = new Date();
    const createdFileName = `${dateNow.getDay()}${dateNow.getMonth()}${dateNow.getFullYear()}${dateNow.getHours()}${dateNow.getMinutes()}${dateNow.getSeconds()}${dateNow.getMilliseconds()}.xlsx`;
    const currentPaymentInfo = req.body;
    const courseInfo = currentPaymentInfo.application.course;
    const clientInfo = currentPaymentInfo.application.client;
    createPaymentFile(currentPaymentInfo, courseInfo, clientInfo, createdFileName);
    try {
        if (await db.payment.findByPk(paymentId)) {
            let paymentFile = await db.file.create({
                                        path: path.join('payments', createdFileName),
                                        paymentId
                                    });
                            paymentFiles.push(paymentFile);
                        }
                        return res.json(paymentFiles);
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};

function createPaymentFile(currentPaymentInfo, courseInfo, clientInfo, createdFileName) {
    writtenNumber.defaults.lang = 'uk';
    const workbook = new xl.Workbook();
    const worksheet = workbook.addWorksheet('Payment', {pageSetup: {orientation: 'landscape'}});
    const styleBold = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12,
            bold: true,
            visibility: 'visible',
            name: 'Arial'
        },
        numberFormat: 'string'
    });
    const styleBoldTextCenterBorderLeftBottomRight = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12,
            bold: true,
            visibility: 'visible',
            name: 'Arial'
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            bottom: {
                style: 'thin',
                color: '#000000'
            },left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            }
        },
        numberFormat: 'string'
    });
    const styleBoldTextCenterBorderBottom = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12,
            bold: true,
            visibility: 'visible',
            name: 'Arial'
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    });
    const alingRightBolt = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12,
            bold: true,
            visibility: 'visible',
            name: 'Arial'
        },
        alignment: {
            horizontal: 'right'
        }
    });
    const styleNormal = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12,
            visibility: 'visible',
            name: 'Arial'
        },
        numberFormat: 'string'
    });
    const styleNormalTextCenterBorderBottomRight = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12,
            visibility: 'visible',
            name: 'Arial'
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            bottom: {
                style: 'thin',
                color: '#000000'
            },left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            }
        },
        numberFormat: 'string'
    });
    const styleNormalAlingCenterHorizont = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12,
            visibility: 'visible',
            name: 'Arial'
        },
        numberFormat: 'string',
        alignment: {
            horizontal: 'center'
        }
    });
    const styleForDate = workbook.createStyle({
        numberFormat: 'dd.mm.yyyy', font: {
            color: '#000000',
            size: 12,
            visibility: 'visible',
            name: 'Arial'
        },
        alignment: {
            horizontal: 'center'
        }
    });
    worksheet.cell(2, 1, 2, 9, true).string('').style(styleBold);
    worksheet.column(2).setWidth(12);
    worksheet.column(3).setWidth(25);
    worksheet.column(4).setWidth(8);
    worksheet.cell(3, 1, 3, 9, true).string('ФОП  Журавльов Сергій Сергійович').style(styleBold);
    worksheet.cell(4, 1, 4, 9, true).string('банк АТ "АльфаБанк"').style(styleBold);
    worksheet.cell(5, 1, 5, 9, true).string('МФО 300346').style(styleBold);
    worksheet.cell(6, 1, 6, 9, true).string('р/р 26003062512801').style(styleBold);
    worksheet.cell(7, 1, 7, 9, true).string('ІПН 3212202619').style(styleBold);
    worksheet.cell(8, 1, 8, 2, true).string('Одержувач послуг:').style(styleBold);
    worksheet.cell(8, 3, 8, 5, true).string(`${clientInfo.name} ${clientInfo.surname}`).style(styleNormal);
    worksheet.column(5).setWidth(15);
    worksheet.column(6).setWidth(5);
    worksheet.cell(11, 1, 11, 4, true).string('Квитанція №').style(alingRightBolt);
    worksheet.cell(11, 5).string(paymentName()).style(styleNormalAlingCenterHorizont);
    worksheet.cell(11, 6).string('від').style(styleBold);
    let arrOfPaymentDate = currentPaymentInfo.paymentDate.split('-');
    let dateArr = [];
    for(let i = arrOfPaymentDate.length - 1; i > -1; i--){
        dateArr.push(arrOfPaymentDate[i]);
    }
    const payDate = dateArr.join('.');
    worksheet.cell(11, 7)
        .string(payDate)
        .style(styleForDate);
    worksheet.column(7).setWidth(13);
    worksheet.cell(12, 1, 12, 9, true).style({border: {
            bottom: {
                style: 'thin',
                color: 'black'
            }
        }});
    worksheet.cell(13, 1).string('№').style(styleBoldTextCenterBorderLeftBottomRight);
    worksheet.cell(13, 2, 13, 6, true).string('Назва').style(styleBoldTextCenterBorderBottom);
    worksheet.cell(13, 7).string('Кількість').style(styleBoldTextCenterBorderLeftBottomRight);
    worksheet.cell(13, 8).string('Ціна').style(styleBoldTextCenterBorderBottom);
    worksheet.cell(13, 9).string('Сума').style(styleBoldTextCenterBorderLeftBottomRight);
    worksheet.cell(14, 1, 15, 1, true).string('1').style(styleBoldTextCenterBorderLeftBottomRight);
    worksheet.cell(14, 2, 14, 6, true).string('За отримання інформаційно - консультаційних послуг з курсу').style(styleBold);
    worksheet.cell(15, 2, 15, 6, true).string(`${courseInfo.name}`).style(styleBoldTextCenterBorderBottom);
    worksheet.cell(14, 7, 15, 7, true).string('1').style(styleNormalTextCenterBorderBottomRight);
    worksheet.cell(14, 8, 15, 8, true).string(`${currentPaymentInfo.amount}`).style(styleNormalTextCenterBorderBottomRight);
    worksheet.cell(14, 9, 15, 9, true).string(`${currentPaymentInfo.amount}`).style(styleNormalTextCenterBorderBottomRight);
    worksheet.cell(16, 7, 16, 8, true).string('Разом').style(styleBoldTextCenterBorderLeftBottomRight);
    worksheet.cell(16, 9).string(`${currentPaymentInfo.amount}`).style(styleNormalTextCenterBorderBottomRight);
    worksheet.cell(18, 1, 18, 9, true).string('Сума прописом:').style(styleBold);
    worksheet.cell(19, 1, 19, 9, true).string(`${writtenNumber(currentPaymentInfo.amount)} грн.`).style(styleNormal);
    worksheet.cell(21, 4, 21, 6, true).string('ФОП  Журавльов С. С.').style(alingRightBolt);
    worksheet.cell(21, 7, 21, 9, true).style(styleBoldTextCenterBorderBottom);
    worksheet.cell(22, 7, 22, 9, true).string('Підпис').style(styleNormalAlingCenterHorizont);

    workbook.write(path.join(paymentsPath, createdFileName));
};


function paymentName() {
    const dateTime = new Date();
    const arrOfNumbersForMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const getMonth = dateTime.getMonth();
    const month = getMonth < 10 ? arrOfNumbersForMonth[getMonth] : getMonth;
    const arrOfNumbersForDay = [0, '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    const getDay = dateTime.getDate();
    const day = getDay < 10 ? arrOfNumbersForDay[getDay] : getDay;
    const hour = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const milliseconds = dateTime.getMilliseconds();

    return `${day}${month}${hour}${minutes}${milliseconds}`;
}
module.exports = controller;
