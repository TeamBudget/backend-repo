const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const {ApolloServer, PubSub} = require("apollo-server-express")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const expressPlayground = require('graphql-playground-middleware-express').default
const expressJwt = require("express-jwt");
const {SECRET_KEY} = require("./credentials.json")
const typeDefs = require("./graphql/TypesDefs")

const resolvers = require("./graphql/resolvers")

const {username, password, dbName} = require("./credentials.json")

const pubsub = new PubSub();

const app = express()


//enable cors
 var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // <-- REQUIRED backend setting
 
}; 
  app.use(cors(corsOptions));

app.use("/graphql",
         bodyParser.json(),
         cookieParser(),
         (req,_,next) => {
           try{
             const user =  jwt.verify(req.cookies.id, SECRET_KEY)
               req.user = user
               console.log("user middleware",user);
               
              }catch(err){
               console.log(err);
           }
           return next();
         })


         const server = new ApolloServer({
          introspection: true, 
          typeDefs,
          resolvers, 
          context:({req,res}) => ({req,res,pubsub, user:req.user}),
          playground:true,
       })

       server.applyMiddleware({app, path: "/graphql", cors: false }) 

      app.get("/playground", expressPlayground({ endpoint: "/graphql" })) 

mongoose
.connect('mongodb+srv://' + encodeURIComponent(`${username}:${password}`) +`@cluster0.z1c7r.mongodb.net/${dbName}?retryWrites=true&w=majority`)
  .then(() => {
    return app.listen({port: process.env.PORT || 4000}, () => {
      console.log(`server is running at ${server.graphqlPath}`)
    })
  })
 .catch(err => {
    console.log(err);
  });




