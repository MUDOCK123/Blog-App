const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const path = require("path");

const Usuario = mongoose.model("usuarios");

Router.get("/user", (req, res) => {
    res.render("usuario/registro.handlebars");
})

module.exports = Router;