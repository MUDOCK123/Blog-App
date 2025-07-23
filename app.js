//Carregando módulos:

const handlebars = require("express-handlebars");
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("./routes/admin");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

// Sempre que utilizar app.use(), é para configurar e usar um middleware no Express.

// Configurações:
const app = express();

// BodyParser:
// O bodyParser é um middleware que analisa o corpo da solicitação e o torna acessível através de req.body. O método urlencoded é usado para analisar dados de formulários, enquanto o método json é usado para analisar dados JSON.
// O parâmetro { extended: true } permite que objetos aninhados sejam analisados corretamente
// *middleware* bodyParser.urlencoded e bodyParser.json são usados para processar os dados do formulário e os dados JSON enviados nas requisições HTTP.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// HandleBars:
// Configurando o Handlebars como motor de visualização, o handlebars.engine é uma função que recebe um objeto de configuração, onde podemos definir o layout padrão e o diretório de partials.:
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "handlebars");

// Public:
// Essa linha de código está dizendo ao Express que a pasta public está guardando todos os arquivos estáticos:
app.use(express.static(path.join(__dirname, "public"))); // O __dirname pega o caminho absoluto até a pasta public.

// Configuração de sessões:

// Sessões:

// Usando o express-session para gerenciar sessões de usuário
app.use(
  session({
    secret: process.env.SECRETKEY, // A chave secreta é usada para assinar o ID da sessão, garantindo que a sessão seja segura.
    resave: true, // O resave: true é usado para forçar a sessão a ser salva novamente, mesmo que não tenha sido modificada. Isso é útil para garantir que a sessão seja atualizada com as informações mais recentes.
    saveUninitialized: true, // O saveUninitialized: true é usado para salvar sessões não inicializadas, o que significa que mesmo que a sessão não tenha sido modificada, ela ainda será salva no armazenamento de sessão.
  })
);

// Usando o connect-flash para exibir mensagens de flash
app.use(flash());

// Configurando middleware:

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); // A mensagem de sucesso é definida no middleware e pode ser acessada nas views.
  res.locals.error_msg = req.flash("error_msg"); // A mensagem de erro é definida no middleware e pode ser acessada nas views.
  next(); // O next() é chamado para passar o controle para o próximo middleware na pilha.
});

// Rotas:
// Rota inicial:
app.get("/", (req, res) => {
  res.render("./Pages/initialPage");
});

app.get("/admin", (req, res) => {
  res.render("./admin/pageAdmin");
});

// Rota de admin, tem o /admin no início porque é a rota base de admin e está com o admin na frente, porque está sendo importadas as rotas do arquivo routes/admin.js. Exemplo: http://localhost:8081/admin/categoria
app.use("/admin", admin);

// Outros:
// Abrindo o servidor na porta 8081, e contem uma função de callback que é executada quando o servidor é iniciado com sucesso:
app.listen(8081, () => {
  console.log("Servidor rodando na porta 8081");
});
