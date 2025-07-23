const mongoose = require("mongoose");
require("dotenv").config();

// O mongoose é um type odm bem parecido com o sequelize, mas é usado para trabalhar com bancos de dados NoSQL, como o MongoDB, que utilizam documentos em vez de tabelas.

mongoose.Promise = global.Promise; // Configurando o Mongoose para usar Promises globais
mongoose.set("strictQuery", false); // Desativando a verificação estrita de consultas

// Conexão com o banco de dados MongoDB usando Mongoose
// A conexão é feita com o banco de dados "blogAppDB" localizado no endereço "mongodb://127.0.0.1:27017/blogAppDB".
const ConnectionDatabase = mongoose.connect(process.env.DATABASE_URI);

module.exports = ConnectionDatabase;