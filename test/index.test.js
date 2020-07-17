const dotenv = require('dotenv').config();
const MsTeamsMessageCard = require('../lib/ms_teams');
const fs = require('fs')
const path = require('path')
jest.mock('../lib/ms_teams');

const EmailMessage = require('../lib/email');
jest.mock('../lib/email')

const Notify = require('../index')

beforeEach(() => {
    MsTeamsMessageCard.mockClear();
    EmailMessage.mockClear();
});
afterEach(() => {
    const cachePath = '/tmp/cache/if-you-need-to-delete-this-open-an-issue-async-disk-cache/node-alert';
    if (fs.existsSync(cachePath)) {
        fs.readdir(cachePath, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(cachePath, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
});

test('test isDoNotAlert() true', () => {
    let notify = new Notify(new EvalError('Test notify 001'), [new EvalError('Test notify 001'), new EvalError('Test notify 002')])
    let res = notify.isDoNotAlert();
    expect(res).toBe(true);
})

test('test isDoNotAlert() false', async() => {
    let notify = new Notify(new EvalError('Error to be alert'), [new EvalError('Test notify 001'), new EvalError('Test notify 002')]);
    let res = notify.isDoNotAlert();
    expect(res).toBe(false);
    // await notify.send()
})

test('test send notification ', async() => {
    let notify = new Notify(new EvalError('Error to be alert'), [new EvalError('Test notify 001'), new EvalError('Test notify 002')]);
    await notify.send()
        // expect(MsTeamsMessageCard).toHaveBeenCalled();
    const msTeamsMock = MsTeamsMessageCard.mock.instances[0];
    const msTeamsSendMock = msTeamsMock.sendMessageCard

    const emailMsgMock = EmailMessage.mock.instances[0];
    const emailMsgSendMock = emailMsgMock.sendAlertMail

    expect(msTeamsSendMock).toHaveBeenCalledTimes(1);
    expect(emailMsgSendMock).toHaveBeenCalledTimes(1);
})

test('test send notification with ignoring error', async() => {
    // error is ignored
    let notify = new Notify(new EvalError('Test notify 001'), [new EvalError('Test notify 001'), new EvalError('Test notify 002')]);
    await notify.send()
    const msTeamsMock = MsTeamsMessageCard.mock.instances[0];

    const emailMsgMock = EmailMessage.mock.instances[0];
    expect(notify.shouldAlert()).toBeTruthy();
    expect(notify.isDoNotAlert()).toBeTruthy();
    expect(msTeamsMock).toBeUndefined();
    expect(emailMsgMock).toBeUndefined();
})


test('test should shouldSendEmail', () => {
    let notify = new Notify(new EvalError("Test notify"), []);
    expect(notify.shouldSendEmail()).toBeTruthy();
    process.env.EMAIL_ALERT_ENABLED = "";
    expect(notify.shouldSendEmail()).toBeFalsy();

})

test('test shouldSendMsTeams ', () => {
    let notify = new Notify(new EvalError("Test notify"), []);
    expect(notify.shouldSendMsTeams()).toBeTruthy();

    process.env.MS_TEAMS_ALERT_ENABLED = "";
    expect(notify.shouldSendMsTeams()).toBeFalsy();
})
