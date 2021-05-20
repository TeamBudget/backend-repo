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
    profileImageUrl:String!
    createdAt:String!
}


type Account{
     id:ID!
     owner:ID!
     title:String!
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
    profileImageUrl:String!
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
     
     getUserAccounts:[Account!]!
     getUserAccount(accountId:ID!):Account!
    }

 type Mutation{
    register(registerInput:RegisterInput):User!
    login(username:String!, password:String!):User!
    resetPassword(email:String!):message
    logout:String!

    
    likePost(postId:ID!):Post!
    
    
    createAccount(title:String!):Account!
    updateAccount(accountId:ID!,title:String!):Account!
    deleteAccount(accountId:ID!):String!



    addItem(accountId:ID!, title:String!, description:String!,media:String,amount:Float):Account!
    updateItem(accountId:ID!, itemId:ID!, title:String!, description:String!, amount:Float):Account!
    deleteItem(accountId:ID!, itemId:ID!):Account!
    addItemImage(accountId:ID!, itemId:ID!, imageURL:String!):Boolean!
    deleteItemImage(accountId:ID!, itemId:ID!):Boolean!


    updateUserProfile(profileImage:String!):User!
    
    uploadFile(file:Upload!):String!
}

type Subscription{
     getallitems:message! 
}`


    