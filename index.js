
// Projeto de uma APi para hamburgueria!!!


const port = 3001
const express = require ('express')
const app = express ()
app.use (express.json())
const uuid = require ('uuid')

/*
- Query Params => meusite.com/users?nome=rodolfo&age=28
-Route Params => /users/2  //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
-Request Body => { "name":"Rodolfo", "age":33}
- GET   => Buscar informação no Back-End
- POST => Criar informação no Back-End
- PUT / PATCH => Alterar/Atualizar Informação no Back-End
- DELETE => Deletar informação no Back-End
-MIDDLEWARE => Interceptador => Têm o poder de parar ou alterar dados da requisição
*/
const firstMiddleware = (request, response, next) =>{
    const { id } = request.params
    const index = User.findIndex(costumer => costumer.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }
    request.orderIndex = index
    request.orderID = id
    next()
}

const secondMiddleWare = (request, response, next) => {
    const {url, method} = request;
    console.log( `${method} - ${url} at ${new Date}` ) // ele trara o metodo que esta sendo executado no momento, data e hora!
    next()
}



const User = []

app.post ('/order', secondMiddleWare, (request, response) => {
    try{
    const { order, clientName, price} = request.body
    if (price<20) throw new Error ("Aceitamos pedidos somente a cima de 20 Reais") // uma maneira que economiza codigo e muito eficiente para descrever um "erro" usando uma logica para isso
    //console.log (uuid)
    const user = {id: uuid.v4(), order, clientName, price, "status": "Em preparação"} // Gerando um id para o usuário
    User.push (user)
    return response.status (201).json (user)
} catch(err) {
    return response.status (500).json ({error:err.message})
} finally {
    console.log ("Terminou tudo!")
}  // o try , catch e finally é para ver se tudo esta ocorrendo bem para o codigo, caso esteja algo errado em meio a aplicação ele retorna aonde esta o erro! 

})


app.get ('/order', secondMiddleWare, (request, response) => {
    //console.log ('A rota foi chamada')
    return response.json(User)
})


app.put ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    const id = request.orderID
    const {order, clientName, price} = request.body
    const updatedOrder = {id, order, clientName, price, "status": "Em preparação"}
    User [index] = updatedOrder
    return response.json(updatedOrder)

})


app.delete ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    User.splice (index,1)
    return response.status(204).json()
})


app.patch ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    const order = User [index]
    order.status = "Pronto"
    return response.json(order)
    
})


app.get ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    return response.send(User [index])
})



app.listen (port, () =>  {
    console.log(`🚀 O servidor esta funcionando na porta ${port}`)
})