const express = require("express");
// Importando o modelo Categorias para interagir com a coleção de categorias no banco de dados
// O modelo Categorias foi definido no arquivo models/Categorias.js
const Categorias = require("../models/Categorias");
const adminSchema = require("../models/Admin");
require("dotenv").config();

// Importando o express para criar as rotas do admin
// O express.Router() é usado para criar um novo roteador que pode ser usado para definir rotas
const router = express.Router();

// Middleware para processar os dados do formulário e ouvir as requisições que chegam ao roteador:
router.use((req, res, next) => {
  next();
});

router.post("/admin", (req, res) => {
  // Renderizando a página de admin
  // Validando os dados do formulário de admin
  // Verificando se os campos de login e senha foram preenchidos corretamente
  let erros = []; // Array para armazenar erros de validação

  if (
    !req.body.login ||
    typeof req.body.login === undefined ||
    req.body.login === null
  ) {
    // Verifica se o campo de login está vazio ou não foi preenchido corretamente
    erros.push({ mensagemDeErro: "Login inválido!" }); // Adiciona um erro ao array de erros se o login for inválido
  }

  if (
    !req.body.senha ||
    typeof req.body.senha === undefined ||
    req.body.senha === null
  ) {
    erros.push({ mensagemDeErro: "Senha inválida!" }); // O push adiciona um novo erro ao array de erros se a senha for inválida
  }

  if (req.body.senha.length > 20) {
    erros.push({ mensagemDeErro: "Senha muito longa!" }); // Verifica se a senha é maior que 20 caracteres e adiciona um erro se for o caso
  }

  if (erros.length > 0) {
    // Se houver qualquer erro dentro do array de erros, renderiza o erro na página de admin
    res.render("admin/pageAdmin", { erros: erros });
  } else {
    res.render("admin/admin"); // Se não houver erros, renderiza a página de admin

    // Depois que passar do formulário de admin, os dados preenchidos nos campos de login e senha serão salvos no banco de dados MongoDB.
    const admin = new adminSchema({
      // Se não houver erros, ele salva os dados do admin no banco de dados
      login: req.body.login,
      password: req.body.senha,
    });

    admin
      .save()
      .then(() => {
        console.log("Cadastro de admin realizado com sucesso!");
      })
      .catch((err) => {
        console.log(`Erro ao cadastrar admin: ${err}`);
      });
  }
});

router.get("/post", (req, res) => {
  res.render("admin/post");
});

router.get("/categoria", (req, res) => {
  res.render("admin/category");
});

// Renderizando a página para adicionar uma nova categoria
// A rota /admin/categoria/nova renderiza a view addCategorias.handlebars
// Estou renderizando a página de adicionar categorias que está localizada na pasta views/admin/addCategorias.handlebars
router.get("/categoria/nova", (req, res) => {
  res.render("admin/addCategorias");
});

// Rota para processar o formulário de adição de categoria
// Quando o formulário é enviado, os dados são enviados para a rota /admin/categoria/success via POST
// A rota processa os dados do formulário e renderiza a página de sucesso.
router.post("/categoria/success", (req, res) => {
  res.render("admin/success");

  // Criando uma nova instância do modelo Categorias com os dados do formulário
  // O req.body contém os dados enviados pelo formulário, onde nomeDaCategoria e tipoDeCategoria são os campos do formulário
  // o req.body é para acessar os dados do formulario que foram enviados via POST.

  const novaCategoria = new Categorias({
    nomeDaCategoria: req.body.nome,
    tipoDeCategoria: req.body.tipo,
  });

  // Esses dados serão salvos no banco de dados MongoDB
  novaCategoria
    .save()
    .then(() => console.log("Dados enviados para o banco de dados!"))
    .catch((err) =>
      console.log(`Erro ao enviar dados para o banco de dados: ${err}`)
    );
});

module.exports = router;
