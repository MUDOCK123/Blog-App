const mongoose = require("mongoose");
// Importando o arquivo de conexão com o banco de dados
require("./db");

// Esse arquivo cria o documento do banco de dados que será usado para armazenar as categorias do blog.

const CategoriaSchema = new mongoose.Schema({
  nomeDaCategoria: {
    type: String,
    required: true,
  },
  tipoDeCategoria: {
    type: String,
    required: true,
  },
});

// O método mongoose.model() é usado para criar um modelo a partir do esquema definido, onde o primeiro parâmetro é o nome do modelo e o segundo é o esquema.
// O nome do modelo é "Categoria", que será usado para interagir com a coleção "categorias" no banco de dados MongoDB.
// O Mongoose automaticamente pluraliza o nome do modelo para criar o nome da coleção no banco de dados, então "Categoria" se tornará "categorias" na coleção.
module.exports = mongoose.model("Categoria", CategoriaSchema);
