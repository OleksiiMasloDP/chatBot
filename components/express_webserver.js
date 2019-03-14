const express = require('express'),
 bodyParser = require('body-parser'),
 querystring = require('querystring'),
 debug = require('debug')('botkit:webserver');

module.exports = function(controller, bot) {

    let webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    let normalizedPath = require("path").join(__dirname, "routes");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        require("./routes/" + file)(webserver, controller);
    });

    webserver.use(express.static('public'));

    webserver.listen(process.env.PORT || 3000, null, function() {

        debug('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);

    });

    controller.webserver = webserver;

    return webserver;

};