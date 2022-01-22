const conexao = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../tokenSecret')

const usuarioLogin = async (req,res) =>{
    const {email, senha} = req.body

    if(!email){
        return res.status(400).json('O campo email é obrigatório')
    }

    if(!senha){
        return res.status(400).json('O campo senha é obrigatório')
    }
    try {
    
        const {rowCount, rows} = await conexao.query('select * from usuarios where email = $1', [email])

    if(rowCount===0){
        res.status(404).json('Usuário não encontrado')
    }

    const usuario = rows[0]

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha)

    if(!senhaVerificada){
        return res.status(403).json('As credencias informadas nao correspondem a nenhum usuário')
    }

    const token = jwt.sign({id:usuario.id}, jwtSecret, {expiresIn:'2h'})

    return res.status(200).json({token})

    } catch (error) {
        return res.status(400).json('error.message')        
    }
    


}

module.exports = {
    usuarioLogin
}