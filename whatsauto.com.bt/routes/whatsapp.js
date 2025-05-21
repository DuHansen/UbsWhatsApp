const express = require('express');
const router = express.Router();
const whatsappAPI = require('../api/whatsapp');  // Importa a lógica do WhatsApp

// Rota para conectar uma nova sessão
router.post('/connect', (req, res) => {
    whatsappAPI.connect(res); 
});


// Rota para enviar mensagem
router.post('/send-message', async (req, res) => {
    try {
        const result = await whatsappAPI.sendMessage();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;