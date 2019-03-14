const debug = require('debug')('botkit:incoming_webhooks');

module.exports = function(webserver, controller) {

    webserver.post('/', function(req, res) {

        // NOTE: we should enforce the token check here

        // respond to Slack that the webhook has been received.
        res.status(200);
        res.send('ok');

        let bot = controller.spawn({});

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res, bot);

    });

    webserver.get('/', function(req, res) {
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {

                // Respond with 200 OK and challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);

            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403)
        }
    });

};