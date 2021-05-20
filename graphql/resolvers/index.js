const usersResolvers = require("./user")
const accountResolvers = require("./account")

module.exports = {

    Query:{
        ...usersResolvers.Query,
        ...accountResolvers.Query
    },

    Mutation:{
        ...usersResolvers.Mutation,
        ...accountResolvers.Mutation
       
    },

    Subscription:{
        ...accountResolvers.Subscription
    }
        
}

