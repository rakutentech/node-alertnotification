const axios = require('axios');
const debug = require('debug')

/**
 *Contructor for MsTeams MessageCard
 *
 * @param {*} err
 */
function MsTeamsMessageCard(err) {
    this.err = err;
    this.messageCard = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "summary": process.env.MS_TEAMS_CARD_SUBJECT,
        "themeColor": process.env.ALERT_THEME_COLOR,
        "title": process.env.ALERT_CARD_SUBJECT,
        "sections": [{
            "activityTitle": process.env.MS_TEAMS_CARD_SUBJECT,
            "activitySubtitle": `Error has occured on ${process.env.APP_NAME}`,
            "facts": [
                { "name": "Environment", "value": process.env.APP_ENV },
                { "name": "Error", "value": this.err.name },
                { "name": "Message", "value": this.err.message + this.err.stack },
            ]
        }],
    }
    debug("Message Card: " + this.messageCard);
}

/**
 * Send MessageCard to the specified MsTeams' channel.
 */
MsTeamsMessageCard.prototype.sendMessageCard = async function() {
    const options = {
        timeout: 5000
    }
    if (process.env.MS_TEAMS_PROXY_URL) {
      options.proxy = {
        host: process.env.MS_TEAMS_PROXY_URL,
        port: parseInt(process.env.MS_TEAMS_PROXY_PORT, 10),
      }
    }
    let client = axios.create(options)
    let response = await client.post(process.env.MS_TEAMS_WEBHOOK, JSON.stringify(this.messageCard));
    return response.status;

}
module.exports = MsTeamsMessageCard;