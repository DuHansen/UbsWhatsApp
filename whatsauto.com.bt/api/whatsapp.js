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
                        '*Atendimento SUS:*\n\n' + 'Escolha uma dúvida:\n1. Como agendar uma consulta no SUS?\n2. Quais são os documentos necessários para ser atendido?\n3. Posso ser atendido em qualquer unidade do SUS?\n4. Como funciona o atendimento de urgência no SUS?\n5. Como saber se meu atendimento está agendado?\n6. Telefone para atendimento especializado\n7. Atendimento (Se preferir falar com um atendente)'
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
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +
                        'Para agendar uma consulta no SUS, você deve procurar uma unidade de saúde mais próxima ou acessar o portal eletrônico do SUS para verificar os procedimentos específicos de agendamento na sua região. Caso precise de ajuda, um atendente pode orientá-lo(a).'
                    );
                } else if (lowerCaseMessage.includes('2')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +
                        'Para ser atendido no SUS, é necessário apresentar documentos como CPF, Cartão SUS, e comprovante de residência. Caso seja uma emergência, o atendimento será imediato.'
                    );
                } else if (lowerCaseMessage.includes('3')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +
                        'Você pode ser atendido em qualquer unidade do SUS, mas é importante verificar a disponibilidade de atendimento na unidade de saúde mais próxima. Dependendo do tipo de serviço, pode ser necessário agendar.'
                    );
                } else if (lowerCaseMessage.includes('4')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +
                        'O SUS oferece atendimento de urgência 24 horas em unidades de pronto atendimento (UPAs) e hospitais. Em casos graves, o atendimento será imediato.'
                    );
                } else if (lowerCaseMessage.includes('5')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +
                        'Você pode verificar o status do seu atendimento entrando em contato com a unidade de saúde onde foi realizado o agendamento ou acessando o portal eletrônico do SUS, caso disponível na sua região.'
                    );
                } else if (lowerCaseMessage.includes('6') || lowerCaseMessage.includes('telefone') || lowerCaseMessage.includes('atendimento especializado')) {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +
                        'Aqui estão os principais números de telefone para atendimento especializado do SUS:\n' +
                        '1. **Disque Saúde**: 136 - Para informações gerais sobre o SUS e serviços de saúde.\n' +
                        '2. **Samu 192**: Para emergências médicas e atendimento de urgência.\n' +
                        '3. **Defensoria Pública**: 129 - Para questões jurídicas relacionadas ao SUS.\n' +
                        '4. **Ouvidoria SUS**: 0800 642 9782 - Para fazer denúncias, sugestões ou reclamações sobre os serviços de saúde.\n' +
                        '5. **Atendimento psicológico e social**: 188 - CVV (Centro de Valorização da Vida), para apoio emocional e prevenção ao suicídio.'
                    );
                } else if (lowerCaseMessage.includes('7') || lowerCaseMessage.includes('atendimento')) {
                    await this.client.sendMessage(message.from, 
                        '*Atendimento SUS:*\n\n' +
                        'Em breve, um de nossos atendentes entrará em contato com você.'+
                        '\nObrigado!'
                    );
                } else {
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' +
                        'Desculpe, não entendi sua dúvida. Responda com o número da sua dúvida.\n1. Como agendar uma consulta no SUS?\n2. Quais são os documentos necessários para ser atendido?\n3. Posso ser atendido em qualquer unidade do SUS?\n4. Como funciona o atendimento de urgência no SUS?\n5. Como saber se meu atendimento está agendado?\n6. Telefone para atendimento especializado\n7. Atendimento (Se preferir falar com um atendente)'
                    );
                }
                return;
            }
    
            if (state === 'atendimento') {
                if (lowerCaseMessage.includes('1') || lowerCaseMessage.includes('voltar para dúvidas')) {
                    this.userState[message.from] = 'duvidas';
                    await this.client.sendMessage(message.from, '*Atendimento SUS:*\n\n' + 
                        'Escolha uma dúvida:\n1. Como agendar uma consulta no SUS?\n2. Quais são os documentos necessários para ser atendido?\n3. Posso ser atendido em qualquer unidade do SUS?'
                    );
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
