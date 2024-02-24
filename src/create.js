const { getMongoCollection } = require("./db")
const {readOneEmail } = require("./read")

async function createDocument(dbName, collectionName, dadosParaInserir) {
  const collection = await getMongoCollection(dbName, collectionName)
  const result = await collection.insertOne(dadosParaInserir)
  // http://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#~insertOneWriteOpResult
  return result.insertedId
}

async function validateDadosParaInserir(dbName, collectionName, dadosParaInserir) {

  let errorMessage = {
    "message": "Os dados introduzidos não são válidos.",
    "errors": {}
  }
  // {
  //     "email": "teste@teste.com",
  //     "password": "A1b2C3d$",
  //     "passwordConfirmation": "A1b2C3d$"
  // }

  // {
  // 	"message": "Os dados introduzidos não são válidos.",
  // 	"errors": {
  // 		"email": "O endereço introduzido já está registado.",
  // 		"passwordConfirmation": "As passwords não coincidem."
  // 	}
  // }

  // validar se algum campo esta vazio
  if (!dadosParaInserir.email) {
    errorMessage.errors["email"] = "O email está vazio."
  }
  if (!dadosParaInserir.password) {
    errorMessage.errors["password"] = "A password está vazia."
  }
  if (!dadosParaInserir.passwordConfirmation) {
    errorMessage.errors["passwordConfirmation"] = "A passwordConfirmation está vazia."
  }

  // retorna se falhar primeiras validacoes
  if (errorMessage.errors.email || errorMessage.errors.password || errorMessage.errors.passwordConfirmation) {
    return errorMessage;
  }

  // confirmar se password é igual a de confirmacao
  if (dadosParaInserir.password != dadosParaInserir.passwordConfirmation) {
    errorMessage.errors["passwordConfirmation"] = "As passwords não coincidem."
  }

  // verificar se o email ja existe
  const result = await readOneEmail(dbName, collectionName, dadosParaInserir.email)
  console.log("result")
  console.log(result)
  if(result)
  {
    errorMessage.errors["email"] = "O endereço introduzido já está registado."
  }

  if (errorMessage.errors.email || errorMessage.errors.passwordConfirmation) {
    return errorMessage;
  }
  
  // retornamos null para ser mais facil de perceber que nao tem mensagem de erro (o objeto nao existe)
  return null
}


module.exports = { createDocument, validateDadosParaInserir }