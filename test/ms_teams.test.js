const dotenv = require('dotenv').config();
const axios = require('axios');
jest.mock('axios');

const MsTeamsMessageCard = require('../lib/ms_teams');

test('should create object', () => {
    let err = new Error("Test MsTeams")
    let msTeamsCard = new MsTeamsMessageCard(err)
    expect(msTeamsCard.messageCard.summary).toBe(process.env.MS_TEAMS_CARD_SUBJECT)
    expect(msTeamsCard.messageCard["@context"]).toBe("http://schema.org/extensions")
    expect(msTeamsCard.messageCard["@type"]).toBe("MessageCard")
    expect(msTeamsCard.messageCard.themeColor).toBe(process.env.ALERT_THEME_COLOR)
    expect(msTeamsCard.messageCard.title).toBe(process.env.ALERT_CARD_SUBJECT)

})

test('should sending message card ', async() => {
    let resp = { 'status': 200, };
    axios.post.mockResolvedValue(resp);
    let err = new Error("Test MsTeams");
    let msTeamsCard = new MsTeamsMessageCard(err)
    msTeamsCard.sendMessageCard().then(status => expect(status).toBe(resp.status))
})