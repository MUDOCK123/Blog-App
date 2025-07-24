const express = require("express");
// Importando o modelo Categorias para interagir com a coleção de categorias no banco de dados
// O modelo Categorias foi definido no arquivo models/Categorias.js
const Categorias = require("../models/Categorias");
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

    // Estou mapeando o array de erros para exibir as mensagens de erro na página de admin
    // O map percorre cada erro no array e extrai a mensagem de erro, juntando-as em uma única string separada por quebras de linha
    // O join("<br>") é usado para separar as mensagens de erro com uma quebra de linha HTML
    req.flash("error_msg", erros.map((e) => e.mensagemDeErro).join("<br>")); // O flash é para exibir mensagens de erro temporárias, assim que o usuário recarregar a página, a mensagem de erro não será mais exibida.
    return res.redirect("/admin"); // Redireciona para a página de admin novamente, só que com as mensagens de erro;
  } else {
    res.render("admin/admin"); // Se não houver erros, renderiza a página de admin
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

router.post("/categoria/success", async (req, res) => {
  // Criando uma nova instância do modelo Categorias com os dados do formulário
  // O req.body contém os dados enviados pelo formulário, onde nomeDaCategoria e tipoDeCategoria são os campos do formulário
  // o req.body é para acessar os dados do formulario que foram enviados via POST.

  // Se o botão de adicionar categoria for pressionado, cria uma nova categoria
  if (req.body.buttonAddCategories !== undefined) {
    // Validando os dados do formulário de adição de categoria
    let arrayOfErrors = [];

    if (
      !req.body.nome ||
      req.body.nome === undefined ||
      req.body.nome === null
    ) {
      arrayOfErrors.push({ mensagemDeErro: "Nome da categoria inválido!" });
    }

    if (
      !req.body.tipo ||
      req.body.tipo === undefined ||
      req.body.tipo === null
    ) {
      arrayOfErrors.push({ mensagemDeErro: "Tipo da categoria inválido!" });
    }

    if(!req.body.idCategoria || req.body.idCategoria === undefined || req.body.idCategoria === null) {
      arrayOfErrors.push({ mensagemDeErro: "ID da categoria inválido!" });
    } 
    
    if (isNaN(req.body.idCategoria)) { // Verifica se o ID da categoria no html é um número, porque o idDaCategoria no schema é do tipo Number, então, se não for um número, adiciona um erro ao array de erros.
      arrayOfErrors.push({ mensagemDeErro: "ID da categoria deve ser um número!" });
    }

    if (arrayOfErrors.length > 0) {
      req.flash(
        "error_msg",
        arrayOfErrors.map((e) => e.mensagemDeErro).join("<br>")
      );
      return res.redirect("/admin/categoria/nova");
    }

    const novaCategoria = new Categorias({
      nomeDaCategoria: req.body.nome,
      tipoDeCategoria: req.body.tipo,
      idDaCategoria: req.body.idCategoria,
    });

    // Salvando a nova categoria no banco de dados
    try {
      await novaCategoria.save(); // O método save() é usado para salvar a nova categoria no banco de dados
      req.flash(
        "success_msg",
        "Categoria salva com sucesso no banco de dados!"
      ); // Se a categoria for salva com sucesso, exibe uma mensagem de sucesso
      return res.redirect("/admin/categoria/nova"); // Redireciona para a página de adicionar categoria após o sucesso
    } catch (err) {
      req.flash("error_msg", "Erro ao salvar a categoria: " + err.message); // Se ocorrer um erro ao salvar, exibe uma mensagem de erro
      return res.redirect("/admin/categoria/nova"); // Redireciona para a página de adicionar categoria após o erro
    }
  }

  // Verificando se o botão de visualizar categorias foi pressionado
  if (req.body.buttonViewCategories !== undefined) {
    try {
      const categorias = await Categorias.find({}); // tem as chaves porque servem para filtrar os dados, nesse caso, estamos buscando todas as categorias
      res.render("admin/success", {
        categorias: categorias.map((categoria) => {
          return {
            nomeDaCategoria: categoria.nomeDaCategoria,
            tipoDeCategoria: categoria.tipoDeCategoria,
            idDaCategoria: categoria.idDaCategoria,
          };
        }),
      }); // Renderiza a página de sucesso com as categorias encontradas
    } catch (err) {
      res.status(500).send("Erro ao buscar categorias: " + err.message);
    }
  }
});

module.exports = router;
