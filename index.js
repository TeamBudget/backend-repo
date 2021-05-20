const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const {ApolloServer, PubSub, graphiqlExpress} = require("apollo-server-express")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const expressPlayground = require('graphql-playground-middleware-express').default
const expressJwt = require("express-jwt");
const {SECRET_KEY} = require("./credentials.json")
const typeDefs = require("./graphql/TypesDefs")
const graphqlHTTP = require('express-graphql');
const resolvers = require("./graphql/resolvers")
const {AuthenticationError} = require("apollo-server")
const {username, password, dbName} = require("./credentials.json")
const checkAuth = require("./util/check-auth")
const pubsub = new PubSub();
const path = require('path');
const app = express()


//enable cors
 var corsOptions = {
  origin: 'https://arcane-lake-94941.herokuapp.com/',
  credentials: true, // <-- REQUIRED backend setting
 
}; 
  app.use(cors(corsOptions));

app.use("/graphql",
         cookieParser(),
         (req,res,next) => {
           
          try{
              
              const user =  jwt.verify(req.cookies.id, SECRET_KEY)
            
              req.user = user
              console.log("user middleware",user);
             console.log("id cookie!!!!!" );
            
              
              }catch(err){
               console.log(err);
              
           }
           return next();
         })


         const server = new ApolloServer({ 
          typeDefs,
          resolvers, 
          context:({req,res}) => ({req,res,pubsub, user: req.user}),
        
       })

       server.applyMiddleware({app, cors:corsOptions}) 

       app.get("/playground",expressPlayground({ endpoint: "/graphql" })) 

      if(process.env.NODE_ENV === 'production'){
        app.use(express.static('client/build'))

        app.get('*', (req, res) => {
           res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'))
        })
      }




mongoose
.connect('mongodb+srv://' + encodeURIComponent(`${username}:${password}`) +`@cluster0.z1c7r.mongodb.net/${dbName}?retryWrites=true&w=majority`,{useUnifiedTopology:true, useNewUrlParser:true})
  .then(() => {
    return app.listen({port: process.env.PORT || 4000}, () => {
      console.log(`server is running at ${server.graphqlPath}`)
    })
  })
 .catch(err => {
    console.log(err);
  });




