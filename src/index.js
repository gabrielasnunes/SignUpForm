const express = require('express')
const app = express()
const PORT = 3030;

const { createDocument, validateDadosParaInserir } = require("./create");
const { readOneEmail, readOneByObjectId } = require("./read.js")

const bodyParser = require('body-parser');
app.use(bodyParser.json());


const dbName = "desafio"
const collectionNameSignUp = "signup"

const sessoes = []

// {
//     "email": "teste@teste.com",
//     "password": "A1b2C3d$",
//     "passwordConfirmation": "A1b2C3d$"
// }

app.post('/api/auth/signup', async (req, res) => {

    // const {dbName, collectionName} = req.params;
    const jsonRecebido = req.body;

    // validar
    let errorMessage = await validateDadosParaInserir(dbName, collectionNameSignUp, jsonRecebido)
    if (errorMessage) {
        res.status(400).json(errorMessage);
    } else {
        let idRecebido = await createDocument(dbName, collectionNameSignUp, jsonRecebido)

        let objMsgFinal = {
            "message": "Utilizador Criado com Sucesso!",
            "_id": idRecebido
        }
        res.status(201).json(objMsgFinal);
    }
})


// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    // Neste endpoint receberás um objeto com duas propriedades: email e password.
    const { email, password } = req.body
    // Deverás começar por verificar se existe algum utilizador com o email recebido. 
    // Se não existir, deverá ser enviada a resposta com o estado 404 e com o conteúdo:
    // { "message": "O utilizador não foi encontrado!" }
    let signUpEncontrado = await readOneEmail(dbName, collectionNameSignUp, email)
    if (!signUpEncontrado) {
        res.status(404).json({ "message": "O utilizador não foi encontrado!" })
    }
    // De seguida deverás verificar se a password recebida é igual à password do utilizador encontrado com o email recebido. 
    //Se não for, deverá ser enviada a resposta com o estado 401 e com o conteúdo:
    // { "message": "A password introduzida é inválida!" }
    if (signUpEncontrado.password != password) {
        res.status(401).json({ "message": "A password introduzida é inválida!" })
    }
    // Por fim, se o utilizador existir e a password estiver correta, deverás enviar uma resposta com 
    // o estado 200 e com um objeto com a propriedade token como corpo. 
    // Deverás ainda adicionar uma sessão com este token a um array de sessões.
    // O token deverá ser o _id da sessão.
    sessoes.push(signUpEncontrado._id.toString());
    res.status(200).json({ "token": signUpEncontrado._id })
})
// Exemplo:
// {
// 	"token": "61db515a5c9e2a7f1b1fd806"
// }



// GET /api/user
// Neste endpoint deverás verificar o header: 
// Authorization e verificar se existe alguma sessão com o token recebido nesse header.

app.get('/api/user', async (req, res) => {
    const token = req.header('Authorization')

    // Se o token não for recebido, deverás responder com o estado 401 e com o conteúdo:
    //{ "message": "Não foi enviado o token de autenticação!" }
    if (!token) {
        return res.status(401).json({ "message": "Não foi enviado o token de autenticação!" })
    }
    //Se não existir uma sessão com o token recebido, deverás responder com o estado 403 e com o conteúdo:
    // { "message": "Não existe nenhuma sessão com o token indicado!" }

    if (!sessoes.includes(token)) {
        return res.status(401).json({ "message": "Não existe nenhuma sessão com o token indicado!" })
    }
    // Caso contrário, deverás enviar uma resposta com o estado 200 e com um objeto com 2 propriedades:
    // _id - o id do utilizador;
    // email - o email do utilizador;

    let buscarObjetoInteiro = await readOneByObjectId(dbName, collectionNameSignUp, token)

    let novoObjeto = {
        "_id": token,
        "email": buscarObjetoInteiro.email
    }

    res.status(200).json(novoObjeto)



})


// GET /api/user/:id
app.get('/api/user/:id', async (req, res) => {

    const { id } = req.params

    // Neste endpoint deverás verificar o header: 
    // Authorization e verificar se existe alguma sessão com o token recebido nesse header.
    const token = req.header('Authorization')
    // Se o token não for recebido, deverás responder com o estado 401 e com o conteúdo:
    // { "message": "Não foi enviado o token de autenticação!" }
    if (!token) {
        res.status(401).json({ "message": "Não foi enviado o token de autenticação!" })
    }
    // Se não existir uma sessão com o token recebido, deverás responder com o estado 403 e com o conteúdo:
    // { "message": "Não existe nenhuma sessão com o token indicado!" }
    if (!sessoes.includes(token)) {
        return res.status(401).json({ "message": "Não existe nenhuma sessão com o token indicado!" })
    }
    // Caso contrário, deverás enviar uma resposta com o estado 200 e com um objeto com 1 propriedade:
    // sameUser - deve ser true se a sessão atual for do utilizador com o id enviado e false caso contrário

    res.status(200).json({ "sameUser": token == id })
})


app.listen(PORT, () => console.log(`À escuta em http://localhost:${PORT}`)) 