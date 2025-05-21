const ClienteController = require('../controller/clientes');

class Clientes {
    static async getClientesOff(req, res) {
        try {
        
            const clientes = await ClienteController.getClientesOff();
               
            return res.status(200).send(clientes);
        } catch (e) {
            console.error('Erro ao buscar clientes:', e);
            return res.status(400).send({ error: e.message });
        }
    }

    static async getClientes(req, res) {
        try {
        
            const clientes = await ClienteController.getClientes();
               
            return res.status(200).send(clientes);
        } catch (e) {
            console.error('Erro ao buscar clientes:', e);
            return res.status(400).send({ error: e.message });
        }
    }
    
    static async getCliente(req, res) {
        const { id } = req.params;  // Acessando o parâmetro `id` na rota
        try {
            const cliente = await ClienteController.getUserById(id);
            if (!cliente) {
                return res.status(404).send({ error: 'Cliente não encontrado' });
            }
            return res.status(200).send(cliente);
        } catch (e) {
            console.error(e);
            res.status(400).send({ error: e.message });
        }
    }

    static async createCliente(req, res) {
        const clientes = req.body; // espera um array de clientes
      
        if (!Array.isArray(clientes)) {
          return res.status(400).send({ error: "Esperado um array de clientes" });
        }
      
        try {
          const resultados = [];
      
          for (const cliente of clientes) {
            const { nome, telefone, descricao, data, horario } = cliente;
      
            if (!nome || !telefone || !descricao || !data || !horario) {
              throw new Error("Todos os campos são obrigatórios em cada cliente.");
            }
      
            const novoCliente = await ClienteController.createCliente(
              nome,
              telefone,
              descricao,
              data,
              horario
            );
            resultados.push(novoCliente);
          }
      
          return res.status(201).send(resultados);
        } catch (e) {
          console.error(e);
          return res.status(400).send({ error: e.message });
        }
      }
      
}

module.exports = Clientes;
