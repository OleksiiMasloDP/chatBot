const verifyWebhook = (req, res) => {
    let VERIFY_TOKEN = 'webhook_oleksiidp_chatbot';

// Parse params from the webhook verification request
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode were sent
    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
};

module.exports = verifyWebhook;