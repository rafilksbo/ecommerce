const express = require('express');
const usuarios = require('./controladores/usuarios')
const login = require('./controladores/login')
const autenticacao = require('./filtro/autenticacao');
const produtos = require('./controladores/produtos')
const { verify } = require('jsonwebtoken');

const rotas = express()

//Usuario(Cadastro)
rotas.post('/usuario', usuarios.cadastrarUsuario)

//Login
rotas.post('/login', login.usuarioLogin)

//Autenticacao
rotas.use(autenticacao.vericarLogin)

//Usuario
rotas.get('/usuario', usuarios.detalharUsuario)
rotas.put('/usuario/:id', usuarios.atualizarUsuario)

//Produtos
rotas.get('/produtos', produtos.listarProdutos)
rotas.get('/produtos/:id', produtos.detalharProduto)
rotas.post('/produtos', produtos.cadastrarProduto)
rotas.put('/produtos/:id', produtos.atualizarProduto)
rotas.delete('/produtos/:id', produtos.deletarProdutos)



module.exports = rotas