const usersResolvers = require("./user")
const accountResolvers = require("./account")

module.exports = {

    Query:{
        ...usersResolvers.Query,
    },

    Mutation:{
        ...usersResolvers.Mutation,
        ...accountResolvers.Mutation
       
    },

    Subscription:{
        ...accountResolvers.Subscription
    }
        
}

