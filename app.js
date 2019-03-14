'use strict';

// Imports dependencies and set up http server
const
    request = require('request'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
const PAGE_ACCESS_TOKEN = "EAAQJjDc2FWYBAJY91toWmOsZCKGK5k7bSCCkEwvgC2ybmiizwZAMNwSsIMKP5HRcLK4gkIcTUR5QL5Hv1BRL0ptWxFGXVQpjA1XP1jva9jeAEhmTQ3ZA5o9ZCdVnDZByg2XqZCloFv6AAglFZAQH535oiknBbM8F6GfGy1U9g7jWgZDZD"
//const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes"
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no"
                            }
                        ]
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = {"text": "Thanks!"}
    } else if (payload === 'no') {
        response = {"text": "Oops, try sending another image."}
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v3.2/me/messages",
        "qs": {"access_token": {PAGE_ACCESS_TOKEN}},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (
            !err
        ) {
            console.log('message sent!')
        }
        else {
            console.error("Unable to send message:" + err);
        }
    })
    ;
}

/*const messageWebhook = require('./message-webhook');
app.post('/', messageWebhook);*/

app.post('/webhook', function (req, res) {

    // Parse the request body from the POST
    let body = req.body;
    const fetch = require('node-fetch');

    if (body.object.get_started) {
        fetch(
            `https://graph.facebook.com/v3.2/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: {
                    'get_started': {
                        "payload": "<postback_payload>"
                    }
                }
            }
        )} else {
        res.sendStatus(404);
    }
    /*const {PAGE_ACCESS_TOKEN} = process.env;
    const fetch = require('node-fetch');

    const sendTextMessage = (userId, text) => {
        return fetch(
            `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    messaging_type: 'RESPONSE',
                    recipient: {
                        id: userId,
                    },
                    message: 'Welcome to Chat Bot',
                }),
            }
        );
    };

    module.exports = (event) => {
        const userId = event.sender.id;
        const message = event.message.text;

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: languageCode,
                },
            },
        };
    };
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    processMessage(event);
                }
            });
        });

        res.status(200).end();
    }*/
// Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

/*const verifyWebhook = require('./verify-webhook');
app.get('/', verifyWebhook);*/

app.get('/webhook', function (req, res) {

    const VERIFY_TOKEN = "webhook_oleksiidp_chatbot";

// Parse params from the webhook verification request
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

// Check if a token and mode were sent
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