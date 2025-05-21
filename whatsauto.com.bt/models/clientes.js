const { db, Sequelize } = require('../config/database');

const Paciente = db.define('pacientes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: Sequelize.STRING,
    telefone: Sequelize.STRING,
    descricao: Sequelize.STRING,
    data: Sequelize.STRING,
    horario: Sequelize.STRING,
    status: {
        type: Sequelize.ENUM('on', 'off'),
        allowNull: false,
        defaultValue: 'off'
    }
});

module.exports = Paciente;
