const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const ClientesController = require('../controller/clientes');
const moment = require('moment-timezone');

class WhatsAppAPI {
    constructor() {
        this.client = null;
        this.isAuthenticated = false;
        this.isReady = false; 
        this.userState = {};
        this.botAtivado = true;
    }

    async connect(res) {
        try {
            if (this.client) {
                return res.status(200).send({ message: 'O cliente já está conectado.' });
            }

            this.client = new Client({
                authStrategy: new LocalAuth(),
                puppeteer: {
                    headless: false
                }
            });

            this.client.on('authenticated', () => this.handleAuthentication(res));
            this.client.on('qr', (qr) => this.handleQrCode(qr, res));
            this.client.on('ready', () => this.handleReady(res));
            this.client.on('message', (message) => this.handleMessage(message));

            await this.client.initialize();
        } catch (error) {
            console.error('Erro ao conectar:', error);
            return res.status(500).send({ error: error.message });
        }
    }

    handleAuthentication(res) {
        console.log('Cliente autenticado!');
        this.isAuthenticated = true;
        return res.status(200).send({ message: 'Cliente autenticado com sucesso!' });
    }

    async handleQrCode(qr, res) {
        try {
            const qrImage = await qrcode.toDataURL(qr);
            console.log('Enviando QR Code...');
            return res.status(200).send({ qrImage });
        } catch (error) {
            console.error('Erro ao gerar QR Code:', error);
            return res.status(500).send({ error: 'Erro ao gerar QR Code' });
        }
    }

    handleReady(res) {
        console.log('Cliente está pronto!');
        this.isReady = true; 
        this.ativarBot();
        return res.status(200).send({ message: 'Cliente está pronto!' });
    }

    async handleMessage(message) {
        
        try {
            const lowerCaseMessage = message.body.toLowerCase();
            if (message.type === 'ptt') {
                console.log('Recebido um áudio (ptt)!');
                    await this.client.sendMessage(message.from, 
                        '*Atendimento SUS:*\n\n' +
                        'Pedimos a gentileza de nos enviar sempre por escrito a sua necessidade. Aguardamos para seguir.' +
                        '\nObrigado!'
                    );     
            }
            if (!this.botAtivado) {
                return;
            }
    
            if (!this.userState[message.from]) {
                this.userState[message.from] = 'inicio';
            }
    
            const state = this.userState[message.from];

            if (state === 'inicio') {
                await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' + 'Olá! Como posso te ajudar? Escolha uma opção:\n1. Dúvidas\n2. Atendimento');
                this.userState[message.from] = 'aguardando_opcao';
                return;  
            }
    
            if (state === 'aguardando_opcao') {
                if (lowerCaseMessage.includes('1') || lowerCaseMessage.includes('dúvidas')) {
                    this.userState[message.from] = 'duvidas';
                    await this.client.sendMessage(message.from, 
                        '*Atendimento SUS:*\n\n' + 'Escolha uma dúvida:\n1. Quando vou receber meu prêmio?\n2. Posso receber o dinheiro no lugar do prêmio?\n3. Como posso garantir que não é um golpe?\n4. Atendimento (Se preferir falar com um atendente)'
                    );
                } else if (lowerCaseMessage.includes('2') || lowerCaseMessage.includes('atendimento')) {
                    this.userState[message.from] = 'atendimento';
                    await this.client.sendMessage(message.from, 
                        '*Atendimento SUS:*\n\n' +
                        'Em breve, um de nossos atendentes entrará em contato com você.'+
                        '\nObrigado!'  
                    );
                } else {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' + 'Desculpe, não entendi sua escolha. Por favor, escolha uma das opções:\n1. Dúvidas\n2. Atendimento');
                }
                return;
            }
    
            if (state === 'duvidas') {
                if (lowerCaseMessage.includes('1')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +'Inicialmente, encaminharemos os documentos para a emissão das Notas Fiscais (NFs). Assim que recebermos o retorno da promotora, faremos o envio e agendaremos a entrega. Pedimos gentilmente que aguarde este processo.');
                } else if (lowerCaseMessage.includes('2')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +'Infelizmente, não é possível substituir o prêmio por dinheiro. Conforme consta no regulamento: O prêmio não poderá ser distribuído ou convertido, total ou parcialmente em dinheiro, de acordo com o Artigo 15, § 5° do Decreto n° 70.951/1972.');
                } else if (lowerCaseMessage.includes('3')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +'Nossa empresa é totalmente confiável e registrada. Certifique-se que seu nome está listado na aba dos ganhadores no site oficial da promoção.');
                } else if (lowerCaseMessage.includes('4') || lowerCaseMessage.includes('atendimento')) {
                    await this.client.sendMessage(message.from, 
                        '*Atendimento SUS:*\n\n' +
                        'Em breve, um de nossos atendentes entrará em contato com você.'+
                        '\nObrigado!'
                    );
                } else {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' + 'Desculpe, não entendi sua dúvida. Responda com o número da sua dúvida.\n1. Quando vou receber meu prêmio?\n2. Posso receber o dinheiro no lugar do prêmio?\n3. Como posso garantir que não é um golpe?\n4. Atendimento (Se preferir falar com um atendente)');
                }
                return;
            }
            
            if (state === 'atendimento') {
                if (lowerCaseMessage.includes('1') || lowerCaseMessage.includes('voltar para dúvidas')) {
                    this.userState[message.from] = 'duvidas';
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' + 'Escolha uma dúvida:\n1. Quando vou receber meu prêmio?\n2. Posso receber o dinheiro no lugar do prêmio?\n3. Como posso garantir que não é um golpe?');
                } else {
                    await this.client.sendMessage(message.from, 
                        '*Atendimento SUS:*\n\n' +
                        'Assim que possível, um de nossos atendentes entrará em contato com você.'+
                        '\nObrigado!'
                    );
                }
                return;
            }
            
    
            console.log('Mensagem recebida:', message);  

    
            await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' + 'Desculpe, não entendi sua mensagem. Poderia reformular ou escolher uma das opções acima?');
    
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    }
    
    
    async ativarBot() {
        try {
            if (!this.isAuthenticated || !this.isReady) {
                throw new Error('O cliente não está autenticado ou pronto.');
            }

            if (this.botAtivado) {
                return { success: true, message: 'Bot já está ativado.' };
            }

            console.log('Bot ativado! Agora aguardando mensagens...');
            this.botAtivado = true;

            return { success: true, message: 'Bot ativado com sucesso!' };

        } catch (error) {
            console.error('Erro ao ativar bot:', error);
            return { success: false, error: error.message };
        }
    }

    
    async sendMessage() {
        try {
            const delayNode = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            if (!this.isAuthenticated) {
                throw new Error('O cliente não está autenticado.');
            }
    
            if (!this.isReady) {
                console.error('O cliente não está pronto para enviar mensagens!');
                throw new Error('O cliente não está pronto para enviar mensagens.');
            }

            let clientes = await ClientesController.getClientesOff();
            console.log('Clientes:', clientes);
    
            for (const cliente of clientes) {
                const { id, nome, telefone,  horario, data } = cliente.dataValues;
    
                if (!nome || !horario || !telefone ) {
                    console.error('Dados do cliente incompletos:', cliente);
                    continue; 
                }
    
                const horaBrasilia = moment().tz('America/Sao_Paulo').hour(); 
                let saudacao;
    
              
                if (horaBrasilia >= 6 && horaBrasilia < 12) {
                    saudacao = 'Bom dia';
                } else if (horaBrasilia >= 12 && horaBrasilia < 18) {
                    saudacao = 'Boa tarde';
                } else {
                    saudacao = 'Boa noite';
                }
    
                const formattedNumber = `55${telefone}@c.us`;
    
                const personalizedMessage = `*Atendimento SUS:*\n\n
                                                Olá, ${saudacao}, ${nome.toUpperCase()}.

                                                Você tem uma consulta agendada para amanhã ${data} às ${horario}


                                                Estamos à disposição.

                                                Att,
                                                SUS.`;

                try {
                    await ClientesController.updateClienteStatus(id, 'on');
                    await delayNode(5000);
                    const sentMessage = await this.client.sendMessage(formattedNumber, personalizedMessage);
                    if (!sentMessage) {
                        console.error(`Falha ao enviar mensagem para ${nome}`);
                    }
                    
                } catch (sendError) {
                    console.error('Erro ao enviar mensagem:', sendError);
                }
            }
    
            return { success: true, message: 'Mensagens enviadas com sucesso!' };
        } catch (error) {
            console.error('Erro ao enviar mensagens:', error);
            return { success: false, error: error.message };
        }
    }    
}

module.exports = new WhatsAppAPI();
