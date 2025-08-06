const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const path = require("path");

const Usuario = mongoose.model("usuarios");

Router.get("/registro/user", (req, res) => {
    res.render("usuario/registro.handlebars");
});

Router.post("/registro/user/success", (req, res) => {
    const {email, senha, senha2} = req.body;

    let arrayOfError = [];

    if(!email || email === null || email === undefined) {
        arrayOfError.push({ erros: "Adicionar email" });
    }

    
})

module.exports = Router;