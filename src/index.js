const cors =  require('cors');
const helmet =  require('helmet');
const  express = require('express');
const { ApolloServer } = require('apollo-server-express')
require('dotenv').config();

const db =  require('./db');
const models =  require('./models');
const typeDefs =  require('./schema')
const resolvers =  require('./resolvers')

const jwt =  require('jsonwebtoken')

const getUser =  token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Session invalid')
    }
  }
}

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST

/* let notes = [
  {id: '1', content: 'This is a note', author: 'Adaom Scott'},
  {id: '2', content: 'This is another note', author: 'Harlow Everly'},
  {id: '3', content: 'Oh hey look, another note!!', author: 'Riley Harrison'},
] */


const app = express()
//app.use(helmet())
app.use(cors())
// DB에 연결
db.connect(DB_HOST);

// 아폴로 서버 설정
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);
    return { models, user }  // mutations과 query 에서 받는다!!!
  }
})
// 아폴로 그래프QL  미들웨어를 적용하고 경로를 /api로 설정
server.applyMiddleware({ app, path: '/api' });

//app.get('/', (req, res)=> res.send('Hello World!'))
//app.listen(port, ()=> console.log(`http://localhost:${port}`))
app.listen({port}, ()=> console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`))

