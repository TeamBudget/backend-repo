const { AuthenticationError, UserInputError } = require("apollo-server")
const Account = require("../../models/Account")
const checkAuth = require("../../util/check-auth")
const {projectStorage} = require("../../firebase")
const arr = []
module.exports = {

    Mutation:{
          
           async addItem(_,{accountId,title, description, media, amount},context){
                
                const newItem =  await Account.findById(accountId)
               
                if(newItem){
                    console.log(context.req.id);
                    newItem.list.push({title, description,media, amount})
                    await newItem.save()
                   
                    const str = "you got a new message!"
                    arr.push(str)
                    context.pubsub.publish('user1', {getallitems:{msg:`you got a ${arr.length} messages!`}})
                    return  newItem; 
                
                }else throw new UserInputError('Account not found!');

            },
            
            async deleteItem(_,{accountId, itemId},context, info){
                
                const account = await Account.findById(accountId)
                if(account){
                    const itemIndex = account.list.findIndex(c => c._id === itemId)
                  
                    account.list.splice(itemIndex, 1);
                        await account.save()
                        return account;
                    
                }else{
                    throw new UserInputError('account not found!')
                }
            },

             uploadFile: async (_, {file}) => {
                let precentage;
                let errors ={};
                const {filename} = await file
                
                 const storageRef = await projectStorage.ref(`/${filename}`);
                    
                 await storageRef.put(file).on('state_changed', (snap) => {
                      precentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                     }, (err) => {
                        errors.err = err;
                     });

                     const url = await storageRef.getDownloadURL();

                  return {url:url, progress:precentage, error:errors};


             }
    },

    Subscription:{
        getallitems:{
           subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator('user1')
             
        }
    }
  


}