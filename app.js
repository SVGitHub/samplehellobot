var restify = require('restify');
var builder = require('botbuilder');
var regexp = require('regex');
var regMtd = new regexp(/(MTD|month)/i);
var regYtd = new regexp(/(YTD|year|yr)/i);
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.BOT_APP_ID,
    appPassword: process.env.BOT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/(Outlet|Store) Visit/i, [
    function (session) {
        session.beginDialog('/outletVisits');
    }
]);

intents.matches(/thank/i, [
    function (session) {
        session.send('No worries buddy!');
    }
]);

intents.matches(/bye/i, [
    function (session) {
        session.send('TaTa!');
    }
]);
intents.matches(/change/i, [
    function (session) {
        session.beginDialog('/profileChange');
    }
]);

intents.matches(/^(hi|hello|hai)/i, [
    function (session) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            session.send('Hello %s! How may I assist you?', session.userData.name);
        }
    }
]);

intents.matches(/^ok/i, [
    function (session) {
       session.send('Anything else I can assist you with?');
    }
]);

intents.matches(/^No/i, [
    function (session) {
        session.send('Hmm...');
    }
]);

intents.matches(/^Yes/i, [
    function (session) {
        session.send('Please lay down your query?');
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('%s, I could not understand your message. Please rephrase.', session.userData.name);
    }
]);

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hello! May I know your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.send('Hello %s! My name is Sellina. How may I assist you?', session.userData.name);
        session.endDialog();
    }
]);

bot.dialog('/profileChange', [
    function (session) {
        builder.Prompts.text(session, 'May I know your new name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.send('Your name has been changed to %s', session.userData.name);
        session.endDialog();
    }
]);

bot.dialog('/outletVisits', [
    function (session) {
        builder.Prompts.text(session, 'Do you want the visits for MTD or YTD?');
    },
    function (session, results) {
        visitChoice = results.response;
        if (regMtd.test(visitChoice)) {
            session.send('Your total visits for the month is 12');
        } else if (regYtd.test(visitChoice)) {
            session.send('Your total visits for the year is 238');
        }
        session.endDialog();
    }
]);