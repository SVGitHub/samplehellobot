var restify = require('restify');
var builder = require('botbuilder');

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

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    //session.send("Hello World");
    session.send("<html>" +
        "< head >" +
        "<meta charset=\"ISO-8859-1\">" +
            "<title>Sample Hello BOT</title>" +
        "</head>" +
        "<body>" +
            "<h2> SUCCESS </h2>" +
        "</body>" +
"</html >");
});