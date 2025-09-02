var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// Importar rotas MVC
var produtosRouter = require("./src/routes/produtoRoutes");
var clientesRouter = require("./src/routes/clienteRoutes");

// Inicializar banco de dados
const { initializeDatabase } = require("./src/config/database");

var app = express();

// Middleware para parsing JSON
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Servir arquivos estáticos (opcional para API)
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/produtos", produtosRouter);
app.use("/clientes", clientesRouter);

// Inicializar banco de dados na inicialização da aplicação
initializeDatabase().catch(console.error);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Para API, retornar JSON ao invés de renderizar página
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500,
    ...(req.app.get("env") === "development" && { stack: err.stack }),
  });
});

module.exports = app;
