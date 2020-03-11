const MsTeamsMessageCard = require('./lib/ms_teams');
const EmailMessage = require('./lib/email');
const throttler = require('./lib/throttler');
const debug = require('debug');

/*
 * 
 */
function Notify(err, doNotAlert) {
    this.err = err;
    this.doNotAlert = doNotAlert || [];
}
Notify.prototype.send = async function() {
    if (await this.shouldAlert()) {
        await this.dispatch()
    }
}

Notify.prototype.dispatch = async function() {
    if (this.shouldSendEmail()) {
        let email = new EmailMessage();
        email.sendAlertMail(this.err);
    }

    if (this.shouldSendMsTeams()) {
        let msTeamsCard = new MsTeamsMessageCard(this.err)
        await msTeamsCard.sendMessageCard()
    }
}
Notify.prototype.shouldAlert = async function() {
    if (!this.isThrottlingEnabled) {
        //Always alert when throttling is disabled.
        return true;
    }
    if (this.isDoNotAlert()) {
        return false;
    }
    const isThrottled = await throttler.isThrottled(this.err)
    return !isThrottled
}

Notify.prototype.isDoNotAlert = function() {
    let found = false
    this.doNotAlert.forEach(element => {
        if (typeof this.err === typeof element && this.err.message === element.message) {
            debug("Do Not Alert error : " + this.err.toString());
            found = true;
            return;
        }
    });
    return found;
}

Notify.prototype.shouldSendMsTeams = function() {
    return process.env.MS_TEAMS_ALERT_ENABLED == "true";
}
Notify.prototype.shouldSendEmail = function() {
    return process.env.EMAIL_ALERT_ENABLED == "true";
}

Notify.prototype.isThrottlingEnabled = function() {
    return process.env.THROTTLING_ENABLED != "false";
}

module.exports = Notify