const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
jest.mock("nodemailer");
const sendMailMock = jest.fn();
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

const EmailMessage = require('../lib/email');



test('should create new emailMessage', () => {
    let optionsWithUser = {
        port: '25',
        host: 'localhost',
        auth: { user: 'test.user', pass: '' },
        tls: { rejectUnauthorized: false }
    }
    let optionsWithoutUser = {
        port: '25',
        host: 'localhost',
        tls: { rejectUnauthorized: false }
    }
    let email = new EmailMessage();
    expect(email.smtpSetting).toStrictEqual(optionsWithUser)

    // witout user auth
    process.env.SMTP_USER = "";
    email = new EmailMessage();
    expect(email.smtpSetting).toStrictEqual(optionsWithoutUser)
})

test('should sendMail', () => {
    let email = new EmailMessage();
    email.sendAlertMail(new Error("Test Sending mail."));
    expect(sendMailMock).toHaveBeenCalled()
})