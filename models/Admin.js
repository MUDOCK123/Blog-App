const mongoose = require('mongoose');
require('./db'); // Importando a conexão com o banco de dados

const adminSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true // Garantindo que a senha seja única
    }
});

module.exports = mongoose.model("Admin", adminSchema);
