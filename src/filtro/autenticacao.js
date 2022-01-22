const conexao = require('../conexao')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../tokenSecret')

const vericarLogin =  async (req, res, next) =>{ 
    const {authorization} = req.headers

    if(!authorization){
        return res.status(404).json('token não foi informado')
    }

    try {
      
        const token = authorization.replace('Bearer', '').trim()

        const {id} = jwt.verify(token, jwtSecret)

        const query = 'select * from usuarios where id = $1'
        const {rowCount, rows} = await conexao.query(query, [id])

        if(rowCount===0){
            return res.status(404).json('Não foi possível encontrar o usuário.')
        }

        const {senha, ...usuario} = rows[0]

        
        req.usuario = usuario
        
        next()

    } catch (error) {
        return res.status(400).json({mensagem: 'O token informado é inválido'})
    }
    
}

module.exports = {
    vericarLogin
}