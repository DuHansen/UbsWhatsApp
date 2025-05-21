const Cliente = require('../models/clientes');  

class ClienteController {

    static async getClientesOff() {
        try {
            const clientes = await Cliente.findAll({
                where: {
                    status: 'off'
                }
            });  
            return clientes;
        } catch (error) {
            throw new Error('Erro ao buscar clientes');
        }
    }

    static async getClientes() {
        try {
            const clientes = await Cliente.findAll();  
            return clientes;
        } catch (error) {
            throw new Error('Erro ao buscar clientes');
        }
    }
    

    static async getClienteById(id) {
        try {
            const cliente = await Cliente.findById(id);  
            return cliente;
        } catch (error) {
            throw new Error('Erro ao buscar cliente');
        }
    }

    static async createCliente(nome, telefone, descricao, data, horario) {
        try {
          if (!nome || !telefone || !descricao || !data || !horario) {
            throw new Error('Todos os campos são obrigatórios.');
          }
      
          const novoCliente = new Cliente({
            nome,
            telefone,
            descricao,
            data,
            horario,
          });
      
          await novoCliente.save();
          return novoCliente;
      
        } catch (error) {
          console.error('Erro no controller ao criar cliente:', error.message);
          throw new Error('Erro ao criar cliente: ' + error.message);
        }
      }
      

    static async updateClienteStatus(clienteId, newStatus) {
        try {
            const cliente = await Cliente.findByPk(clienteId);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }

            cliente.status = newStatus;
            await cliente.save();

            console.log(`Status do cliente ${clienteId} atualizado para ${newStatus}`);
        } catch (error) {
            console.error('Erro ao atualizar status do cliente:', error);
        }
    }
}

module.exports = ClienteController;
