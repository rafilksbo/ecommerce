const conexao = require('../conexao')
const bcrypt = require('bcrypt')

const cadastrarUsuario = async (req,res) =>{
    const {nome, email, senha, nome_loja} = req.body

    if(!nome){
        return res.status(400).json('O Campo nome é obrigatório')
    }

    if(!email){
        return res.status(400).json('O Campo email é obrigatório')
    }

    if(!senha){
        return res.status(400).json('O Campo senha é obrigatório')
    }

    if(!nome_loja){
        return res.status(400).json('O Campo nome_loja é obrigatório')
    }

    try {
        const {rowCount:quantidadeUsuarios} = await conexao.query('select * from usuarios where email = $1', [email])

        if(quantidadeUsuarios > 0){
            return res.status(403).json('Este email já está cadastrado no sistema')
        }

        const hash = await bcrypt.hash(senha,10)

        const query = 'insert into usuarios (nome, email, senha, nome_loja) values($1, $2, $3, $4)'
        const usuarioCadastrado = await conexao.query(query, [nome, email, hash, nome_loja])

        if(usuarioCadastrado.rowCount===0){
            return res.status(400).json('Não foi possível cadastrar o usuário')
        }

        return res.status(201).json('Usuário cadastrado com sucessp')

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const detalharUsuario = async (req,res) =>{
    const {usuario} = req
    
    try {
        const {rowCount} = await conexao.query('select * from usuarios where id = $1', [usuario.id])

        if(rowCount===0){
            return res.status(404).json({mensagem:'Não foi possível localizar o usuário'})
        }

        return res.status(200).json(usuario)

    } catch (error) {
        return res.status(400).json({mensagem: 'ocorreu um erro inesperado' + error.message})
    }
}

const atualizarUsuario = async (req, res) =>{
    const {usuario} = req
    const {id} = req.params
    const {nome, email, senha, nome_loja} = req.body

    if(!nome){
        return res.status(401).json('O Campo nome é obrigatório')
    }

    if(!email){
        return res.status(401).json('O Campo email é obrigatório')
    }

    if(!senha){
        return res.status(401).json('O Campo senha é obrigatório')
    }

    if(!nome_loja){
        return res.status(401).json('O Campo nome_loja é obrigatório')
    }

    try {
        
        const {rowCount:quantidadeUsuarios} = await conexao.query('select * from usuarios where email = $1', [email])

        if(quantidadeUsuarios > 0){
            return res.status(401).json('Este email já está cadastrado no sistema')
        }

        const hash = await bcrypt.hash(senha,10)

        const query = 'update usuarios set nome = $1, email= $2, senha = $3, nome_loja =$4 where id = $5' 
        const usuarioAtualizado = await conexao.query(query, [nome, email, hash, nome_loja, usuario.id])

        if(usuarioAtualizado.rowCount===0){
            return res.status(401).json({mensagem:'Não foi possível atualizar o usuário'})
        }

        return res.status(201).json('Usuário atualizado com sucesso')

    } catch (error) {
        return res.status(401).json({mensagem: 'Ocorreu um erro inesperado ' + error.message})
    }

}

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}