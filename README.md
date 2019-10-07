# node-alertnotification

This library supports sending alert as email and as message card to Ms Teams' channel. It is built with `node --version v12.8.1`

[![CircleCI](https://circleci.com/gh/rakutentech/node-alertnotification/tree/master.svg?style=svg)](https://circleci.com/gh/rakutentech/node-alertnotification/tree/master)

## Installing

```bash
    npm install --save https://github.com/rakutentech/node-alertnotifiation
```

## Configurations

* This package use `.env` as setting. You can use `dotenv` to load the configuration values from `.env`.

### General Configs

|No   |Environment Variable    |default   |Explanation   |
|---|---|---|---|
|1   |APP_ENV   | "" | application envinronment to be appeared in email/teams message     |
|2   |APP_NAME   | ""  | application name to be appeared in email/teams message   |
|3   |   |   |   |

### Email Configs

|No   |Environment Variable    |default       |Explanation   |
|---|---|---|---|
|1   |EMAIL_ALERT_ENABLED   |"false"    |"false" disabled by default. Change to "true" to enable     |
|2   |EMAIL_SENDER   |""   | *require sender email address   |
|3   |EMAIL_RECIEVERS   | ""  | *require receiver email addresses. Multiple address separated by comma. eg. test1@example.com, test2@example.com   |
|4   |SMTP_HOST   |""  | *required SMTP server hostname   |
|5   |SMTP_PORT   |"" | *required SMTP server port  |
|6   |SMTP_USER   |""   | *required only when smtp server need authentication. SMTP username   |
|7   |SMTP_PASSWORD   |""   |*required only when smtp server need authentication. SMTP user's passord   |
8    |EMAIL_SUBJECT|""|*required Email subject|

### Ms Teams Configs

|No   |Environment Variable    |default   |Explanation   |
|---|---|---|---|
|1   |MS_TEAMS_ALERT_ENABLED   |  "false" |  disabled by default. Change to "true" to enable   |
|2   |MS_TEAMS_CARD_SUBJECT   |""   | *require Ms teams card subject  |
|3   |ALERT_CARD_SUBJECT   |""   | *require Alert MessageCard subject   |
|4   |ALERT_THEME_COLOR   |""   |Themes color   |
|5   |MS_TEAMS_WEBHOOK   |""   |*require Ms Teams webhook. <https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/connectors/connectors-using> |
|6   |   |   |   |

### Throttling Configs

|No   |Environment Variable    |default   |Explanation   |
|---|---|---|---|
|1   |THROTTLING_DURATION   | 5 | throttling duration in minute     |
|2   |THROTTLING_CACHE_KEY   | /tmp/cache/  | disk location for throttling    |
|3   |THROTTLING_ENABLED  | "true"  | Enabled by default to avoid sending too many notification. Set it "false" to disable. Enable this it will send notification only 1 for the same error within `THROTTLING_DURATION`. Otherwise, it will send each occurence of the error. Recommended to be enable. |

* Reference for using message card :
<https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/cards/cards-reference>
<https://www.lee-ford.co.uk/send-message-cards-with-microsoft-teams/>

## Usage

```javascript
// All required configurations must be loaded to environment.

const Notify = require('node-alertnotification');

 //Create New Notify
 let notify = new Notify(new EvalError('Test notify 001'), [new EvalError('Test notify 001'), new EvalError('Test notify 002')])

 //Send notification
notify.send();

```
