const gql = require("graphql-tag");


module.exports = gql`
 type Post{
     id:ID!
     body:String!
     title:String!
     createdAt:String!
     username:String!
     comments:[Comment]!
     likes:[Like]!
     likeCount:Int!
     commentCount:Int!
     imagePost:String
    }

type Comment{
    id:ID!
    createdAt:String!
    username:String!
    body:String!
}   

type Like{
    id:ID!
    createdAt:String!
    username:String!
}


 input RegisterInput{
     username:String!
     email:String!
     password:String!
     confirmPassword:String!
}

type User{
    id:ID!
    email:String!
    token:String!
    username:String!
    firebase_user_id:ID!
    createdAt:String!
}


type Account{
     id:ID!
     owner:ID!
     list:[ItemList]!
     createdAt:String!
     updatedAt:String!

}
 
type ItemList {
    id:ID!
    title:String!
    description:String!
    media:String
    amount:Float
    createdAt:String!
    updatedAt:String!
}

type message{
    msg:String
}

type userState{
    email:String
    id:String
    username:String
}


type imageDetails {
    url: [String]!
    progress:Float
    error: String
}


type Query{
     getPosts:[Post!]!
     getPost(postId:ID!):Post
     
     getUserState:userState
     
    }

 type Mutation{
    register(registerInput:RegisterInput):User!
    login(username:String!, password:String!):User!
    resetPassword(email:String!):message
    
    createPost(title:String!, body:String!, imagePost:String!):Post!      
    deletePost(postId:ID!):String!
    createComment(postId:ID!, body:String!):Post!
    deleteComment(postId:ID!, commentId:ID!):Post!
    likePost(postId:ID!):Post!
    
    addItem(accountId:ID!, title:String!, description:String!,media:String,amount:Float):Account!
    deleteItem(accountId:ID!, itemId:ID!):Account!

   

    uploadFile(file:Upload!): imageDetails!
}

type Subscription{
     getallitems:message! 
}`


    