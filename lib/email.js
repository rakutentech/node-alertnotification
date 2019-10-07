const nodemailer = require('nodemailer');
const debug = require('debug')

/**
 * Constructor : EmailMessage using nodemailer
 */
function EmailMessage() {

    this.smtpSetting = {
        port: process.env.SMTP_PORT,
        host: process.env.SMTP_HOST,
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    }
    if (process.env.SMTP_USER.length > 0) {
        this.smtpSetting.auth = {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    }

    this.transporter = nodemailer.createTransport(this.smtpSetting);
    this.mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: process.env.EMAIL_RECIEVERS,
        subject: process.env.EMAIL_SUBJECT,
        text: ""
    };
}

/**
 * Send alert mail of the given error.
 * 
 * @param  Error err
 */
EmailMessage.prototype.sendAlertMail = function(err) {
    this.mailOptions.text = err.name + "\n" + err.message + ":\n" + err.stack;
    debug(this.mailOptions);
    this.transporter.sendMail(this.mailOptions, function(error, info) {
        if (error) {
            throw error
        }
    });
}
module.exports = EmailMessage;