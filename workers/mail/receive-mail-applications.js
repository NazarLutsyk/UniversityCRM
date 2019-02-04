const Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;
const MailCredentials = require('../../config/mail');
let EventEmitter = require('events').EventEmitter;

let emitter = new EventEmitter();


const MONTHS = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
];

let imap = new Imap({
    user: MailCredentials.EMAIL,
    password: MailCredentials.PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true
});

imap.connect();

function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}

function performMessage(stream, info) {
    // JSON regular \{(?:[^{}]|(?R))*\}}
    let buffer = '';
    stream.on('data', function (chunk) {
        buffer += chunk.toString('utf8');
    });
    stream.on('end', function () {
        simpleParser(buffer)
            .then(parsed => {
                    let jsonApp = parsed
                        .html
                        .replace(/&quot;/g, '\"')
                        .replace(/(<a.*?>|<\/a>)/gmi, '')
                        .match(/\{(?:[^{}]|(R?))*\}/igm)[0];
                    console.log(jsonApp);
                    emitter.emit('data',
                        {
                            from: parsed.from.value[0].address,
                            to: parsed.to.value[0].address,
                            subject: parsed.subject,
                            json: jsonApp ? JSON.parse(jsonApp) : null
                        }
                    );
                }
            )
            .catch(err => {
                emitter.emit('error', err);
            });
    });
    stream.on('error', (err) => {
        emitter.emit('error', err);
    })
}

imap.once('ready', function () {

    openInbox((err, box) => {
        imap.on('mail', (countOfNewMessagesArr) => {
            openInbox(function (err, box) {
                if (err) emitter.emit('error', err);

                const now = new Date();
                now.setDate(now.getDate() - 1);
                const since = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

                imap.search(['UNSEEN', ['FROM', 'nlutsik3@gmail.com'], ['SINCE', since]], function (err, results) {
                    if (err) emitter.emit('error', err);

                    let imapQuery = imap.fetch(results, {bodies: '', markSeen: true});

                    imapQuery.on('message', function (msg, seqno) {
                        msg.on('body', performMessage);
                    });

                    imapQuery.on('error', function (err) {
                        emitter.emit('error', err);
                    });
                });
            });
        });
    })
});

imap.once('error', function (err) {
    emitter.emit('error', err);
});

imap.once('end', function () {
    console.log('Connection ended');
});

module.exports = emitter;

