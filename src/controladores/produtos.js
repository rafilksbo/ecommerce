const conexao = require('../conexao')

const listarProdutos = async (req,res) =>{
    const {id} = req.usuario
    
    try {
        const {rows:produtos} = await conexao.query('select * from produtos where usuario_id = $1', [id])
        return res.status(200).json(produtos)
    } catch (error) {
        return res.status(401).json({mensagem: 'Ocorreu um erro inesperado ' + error.message})
    }
}

const detalharProduto = async (req, res) =>{
    const {id:usuario_id} = req.usuario
    console.log(usuario_id)
    const {id:produto_id} =req.params

    try {
        const produtoExistente = await conexao.query('select * from produtos where id = $1', [produto_id])

        if(produtoExistente.rowCount===0){
            return res.status(401).json({mensgem:`Não há nenhum produto listado com esse ID ${produto_id}`})
        }

        const produtoDoUsuario = await conexao.query('select * from produtos where id=$1 and usuario_id = $2', [produto_id, usuario_id])

        if(produtoDoUsuario.rowCount===0){
            return res.status(403).json({mensagem:"O usuário logado não tem permissão para acessar este produto."})
        }

        return res.status(200).json(produtoDoUsuario.rows)

    } catch (error) {
        return res.status(401).json({mensagem: 'Ocorreu um erro inesperado ' + error.message})
    }
}

const cadastrarProduto = async (req,res) =>{
    const {id} = req.usuario
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body

    if(!id){
        return res.status(401).json({mensagem: "Para cadastrar um produto, o usuário deve estar autenticado"})
    }

    if(!nome){
        return res.status(401).json('O Campo nome é obrigatório')
    }

    if(quantidade <=0){
        return res.status(403).json('A quantidade do produto a ser cadastrado deve ser maior que 0')
    }

    if(!quantidade){
        return res.status(401).json('O Campo quantidade é obrigatório')
    }

    if(!preco){
        return res.status(401).json('O Campo preço é obrigatório')
    }

    if(!descricao){
        return res.status(401).json('O Campo descrição é obrigatório')
    }

    try {
        
        const query = 'insert into produtos (usuario_id, nome , quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)'
        const {rows:produtoCadastrado} = await conexao.query(query, [id, nome, quantidade, categoria, preco, descricao, imagem])

        if(produtoCadastrado.rowCount===0){
            return res.status(401).json({mensagem:'Não foi possível cadastrar o produto'})
        }
        
        return res.status(201).json('Produto cadastrado com sucesso')

    } catch (error) {
        return res.status(401).json({mensagem: 'Ocorreu um erro inesperado ' + error.message})
    }
}

const atualizarProduto = async (req, res) =>{
    const {id:usuario_id} = req.usuario
    const {id:produto_id} = req.params
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body


    if(!nome){
        return res.status(401).json('O Campo nome é obrigatório')
    }

    if(quantidade <=0){
        return res.status(403).json('A quantidade do produto a ser cadastrado deve ser maior que 0')
    }

    if(!quantidade){
        return res.status(401).json('O Campo quantidade é obrigatório')
    }

    if(!preco){
        return res.status(401).json('O Campo preço é obrigatório')
    }

    if(!descricao){
        return res.status(401).json('O Campo descrição é obrigatório')
    }
    
    try {
        const produtoExistente = await conexao.query('select * from produtos where id = $1', [produto_id])

        if(produtoExistente.rowCount===0){
            return res.status(401).json({mensgem:`Não há nenhum produto listado com esse ID ${produto_id}`})
        }

        const produtoDoUsuario = await conexao.query('select * from produtos where id=$1 and usuario_id = $2', [produto_id, usuario_id])

        if(produtoDoUsuario.rowCount===0){
            return res.status(403).json({mensagem:"O usuário logado não tem permissão para atualizar este produto."})
        }

        const query = `update produtos
         set nome =$1, quantidade=$2, categoria=$3, preco=$4, descricao=$5, imagem=$6
         where id=$7`

         const produtoAtualizado = await conexao.query(query, [nome, quantidade, categoria, preco, descricao, imagem, produto_id])

        if(produtoAtualizado.rowCount===0){
            return res.status(403).json({mensagem:"Não foi possível atualizar este produto."})
        }

        return res.status(200).json('Produto atualizado com sucesso')

    } catch (error) {
        return res.status(401).json({mensagem: 'Ocorreu um erro inesperado ' + error.message})
    }
}

const deletarProdutos = async (req,res) =>{
    const {id:produto_id} = req.params
    const {id:usuario_id} = req.usuario

    try {
        
        const produtoExistente = await conexao.query('select * from produtos where id = $1', [produto_id])

        if(produtoExistente.rowCount===0){
            return res.status(401).json({mensgem:`Não há nenhum produto listado com esse ID ${produto_id}`})
        }

        const produtoDoUsuario = await conexao.query('select * from produtos where id=$1 and usuario_id = $2', [produto_id, usuario_id])

        if(produtoDoUsuario.rowCount===0){
            return res.status(403).json({mensagem:"O usuário logado não tem permissão para deletar este produto."})
        }

        const produtoDeletado = await conexao.query('delete from produtos where id = $1', [produto_id])

        if(produtoDeletado===0){
            return res.status(403).json({mensagem: 'Não foi possível deletar o produto'})
        }

        return res.status(200).json('Produto deletado com sucesso')

    } catch (error) {
        return res.status(401).json({mensagem: 'Ocorreu um erro inesperado ' + error.message})
    }
}


module.exports = {
    listarProdutos,
    detalharProduto,
    cadastrarProduto,
    atualizarProduto,
    deletarProdutos
}