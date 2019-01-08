const Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;
const MailCredentials = require('../../config/mail');

let globalResolve = null;
let globalReject = null;

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

function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}

function performMessage(stream, info) {
    // JSON regular \{(?:[^{}]|(?R))*\}}
    let buffer = '';
    stream.on('data', function (chunk) {
        buffer += chunk.toString('utf8');
    });
    stream.once('end', function () {
        simpleParser(buffer)
            .then(parsed => {
                    let jsonApp = parsed
                        .html
                        .replace(/&quot;/g, '\"')
                        .replace(/(<a.*?>|<\/a>)/gmi, '')
                        .match(/\{(?:[^{}]|(R?))*\}/igm)[0];
                    globalResolve(
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
                console.log(err);
            });
    });
}

imap.once('ready', function () {

    openInbox((err, box) => {
        imap.on('mail', (countOfNewMessagesArr) => {
            openInbox(function (err, box) {
                if (err) globalReject(err);

                const now = new Date();
                now.setDate(now.getDate() - 1);
                const since = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

                imap.search(['UNSEEN', ['FROM', 'nlutsik3@gmail.com'], ['SINCE', since]], function (err, results) {
                    if (err) globalReject(err);

                    let imapQuery = imap.fetch(results, {bodies: '', markSeen: true});

                    imapQuery.on('message', function (msg, seqno) {
                        msg.on('body', performMessage);
                    });

                    imapQuery.once('error', function (err) {
                        globalReject(err);
                    });
                });
            });
        });
    })
});

imap.once('error', function (err) {
    globalReject(err);
});

imap.once('end', function () {
    console.log('Connection ended');
});

module.exports = () => {
    return new Promise((resolve, reject) => {
        globalResolve = resolve;
        globalReject = reject;
        imap.connect();
    });
};

