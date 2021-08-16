const express = require('express')
const path = require('path') // manipular caminhos de pastas - para MVC
const fs = require('fs')

const app = express()

app.set('view engine', 'ejs') // definindo o template da engine EJS - renomear os arquivos html para .ejs


//* ---- MVC - Model View Controller ----

//? console.log(__dirname) // caminho completo do página a ser exibida

//Definindo os arquivos estáticos

//! forma explicativa

// const staticFolder = path.join(__dirname, 'views') // definição do path da pasta views
// console.log(staticFolder)
// const expressStatic = express.static(staticFolder) // definição da pasta de arquivos estáticos
// app.use(expressStatic) // middleware - "app, usa essa aplicação"

//! de forma reduzida, as linhas a cima ficam assim:

// app.use(express.static(path.join(__dirname, 'views')))
//! como estamos utilizando a engine EJS, essa linha não é mais necessária
//! o EJS já vai buscar os arquivos estáticos automaticamente


//Definindo os arquivos públicos

const publicFolder = path.join(__dirname, 'public')
//? console.log(staticFolder)
const expressPublic = express.static(publicFolder) 
app.use(expressPublic)

//! a forma reduzida seria assim:
// app.use(express.static(path.join(__dirname, 'public')))

//* Middleware para receber dados do metodo POST

app.use(express.urlencoded({ extended: true })) // habilita server para receber dados via POST de um formulário

//* ---- MVC - fim ----


//* ---- ROTAS ----

app.get('/', (req, res) => { //request, response
  // res.send('Hello World!')
  // res.render('views/index')
  //!como estamos utilizando EJS, não é mais necessário o views/, o EJS faz a busca automática
  res.render('index', {
    titulo: 'Estúdio Leaf - Home'
  })
})

app.get('/posts', (req, res) => { //request, response
  res.render('posts', {
    titulo: 'Estúdio Leaf - Posts',
    posts: [
      {
        title: 'Título primeiro',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam dolor nesciunt blanditiis nihil officiis voluptas consequatur a, eum iste reiciendis, nisi similique officia delectus ullam. Dolorem error asperiores quos ut!',
        stars: 3
      },
      {
        title: 'Título segundo',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam dolor nesciunt blanditiis nihil officiis voluptas consequatur a, eum iste reiciendis, nisi similique officia delectus ullam. Dolorem error asperiores quos ut!',
      },
      {
        title: 'Título terceiro',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam dolor nesciunt blanditiis nihil officiis voluptas consequatur a, eum iste reiciendis, nisi similique officia delectus ullam. Dolorem error asperiores quos ut!',
        stars: 5
      }
    ]
  })
})

app.get('/cadastro-posts', (req, res) => { 
  console.log(req.query)
  const { c } = req.query // desetrutura c
  res.render('cadastro-posts', {
    titulo: 'Estúdio Leaf - Cadastro de Posts',
    cadastrado: c, // nomeia c como cadastrado para usar no if do cadastro-posts.ejs
  })
})

//Rota de envio - POST

app.post('/salvar-post', (req, res) => {
  //console.log(req.body)
  const { titulo, texto } = req.body

  const data = fs.readFileSync('./store/posts.json') // lê os dados do post
  const posts = JSON.parse(data) // transforma os dados em JSON

  posts.push({ // adiciona os dados em JSON
    titulo,
    texto,
  })

  const postsString = JSON.stringify(posts) // transforma de volta em string

  fs.writeFileSync('./store/posts.json', postsString)

  res.redirect('/cadastro-posts?c=1') // ?c=1 devolve um valor para cadastro-posts
})

//404 error

app.use ((req, res) => { // middleware
  res.send('Página não encontrada!')
})

//* ---- ROTAS - fim ----


//* ---- EXECUTANDO O SERVIDOR ----

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server está ouvindo na porta ${port}`))

//* ---- EXECUTANDO O SERVIDOR - fim ----