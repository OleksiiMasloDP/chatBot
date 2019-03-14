const fetch = require('node-fetch');

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const { FACEBOOK_ACCESS_TOKEN } = "EAAQJjDc2FWYBAJY91toWmOsZCKGK5k7bSCCkEwvgC2ybmiizwZAMNwSsIMKP5HRcLK4gkIcTUR5QL5Hv1BRL0ptWxFGXVQpjA1XP1jva9jeAEhmTQ3ZA5o9ZCdVnDZByg2XqZCloFv6AAglFZAQH535oiknBbM8F6GfGy1U9g7jWgZDZD";

const sendTextMessage = (userId, text) => {
    return fetch(
        `https://graph.facebook.com/v3.2/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
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
                message: {
                    text,
                },
            }),
        }
    );
};

module.exports = (event) => {
    const userId = event.sender.id;
    const message = event.message.text;

    const request = {
        //session: sessionPath,
        //queryInput: {},
            text: {
                text: message,
                //languageCode: languageCode,
            },
    };

    /*sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            return sendTextMessage(userId, result.fulfillmentText);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });*/
};