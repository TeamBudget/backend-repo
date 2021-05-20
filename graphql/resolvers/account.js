const { AuthenticationError, UserInputError } = require("apollo-server")
const Account = require("../../models/Account")
const User = require("../../models/User")
const FormData = require('form-data')
const {projectStorage} = require("../../firebase")
const arr = []
const checkAuth = require("../../util/check-auth")
const { v4: uuidv4 } = require('uuid')
const Axios = require("axios").default;
const cloudinary = require('cloudinary').v2;
const { ArrowBackIosTwoTone } = require("@material-ui/icons")


//cloudinary config
cloudinary.config({ 
    cloud_name: 'dw4v5axnj', 
    api_key: '577241728873623', 
    api_secret: 'lrmL9rRbBvtuGsYcnUOKIL9KdI4' 
  });



module.exports = {

    Mutation:{
          
            async createAccount(_,{title},context,info){
                const userId = context.req.user.id;
                   
                  const newAccount = new Account({
                      title: title,
                      owner:userId
                    })
             
                   try{
                    const account = await newAccount.save()
                    
                     return account;
                    
                      
                }catch(err){
                       console.log(err);
                   }
                   },

                   async updateAccount(_,{accountId,title},context,info){
                    
                       try{
                        const account = await Account.findById(accountId)
                        if(account){
                            account.title = title
                          await account.save()
                          return account;
                        }
                         
                        
                          
                    }catch(err){
                           console.log(err);
                       }
                },

              
               async deleteAccount(_,{accountId},context,info){
                 
                  try{
                      
                    const account = await Account.findById(accountId);
                    if(account){
                      await account.delete()

                      return "account deleted succesfully!"
                    }

                  }catch(err){
                      console.log(err);
                  }
                    

               },
                


           async addItem(_,{accountId,title, description, media, amount},context){
                
                const account =  await Account.findById(accountId)
               
                if(account){
                    console.log(context.req.id);
                    account.list.push({title, description,media, amount})
                    await account.save()
                   
                    const str = "you got a new message!"
                    arr.push(str)
                    context.pubsub.publish('user1', {getallitems:{msg:`you got a ${arr.length} messages!`}})
                    return  account; 
                
                }else throw new UserInputError('Account not found!');

            },


            async updateItem(_,{accountId, itemId, title, description ,amount},context){
                
                try{
                    const account = await Account.findById(accountId)

                    if(account){
                        const item = account.list.filter(item => item._id == itemId)
                        if(item){
                            item[0].title = title
                            item[0].description = description
                            item[0].amount = amount
                           await account.save();

                           return account;
                        }  
                       
                    }else{
                        throw new UserInputError('Account not found!');
                    }

                }catch(err){
                    console.log(err);
                    return false;
                }

            },


            
            async deleteItem(_,{accountId, itemId},context, info){
                
                const account = await Account.findById(accountId)
                if(account){
                    
                    const username = context.req.user.username
                    const path = `Users/${username}/myAccounts/${accountId}/${itemId}`
                    const itemIndex = account.list.findIndex(c => c._id == itemId)
                    const item = account.list.filter(c => c._id == itemId)[0]
                    
                    account.list.splice(itemIndex, 1)
                    
                   
                    if(item.media !== ''){
                     await cloudinary.api.delete_resources_by_prefix(path) // if has image inside
                     await cloudinary.api.delete_folder(path) // if folder is empty 
                    }
                    
                    
                 
                   await account.save()
                    return account;
                  
                    
                    
                }else{
                    throw new UserInputError('account not found!')
                }
            },

             uploadFile: async (_, {file},context) => {
              
               
                  
 


              const formData = new FormData()
              
                try{
               /*  formData.append('file', file)
                formData.append('upload_preset',"temed3va") */
               
               /// const {data} = await Axios.post("https://api.cloudinary.com/v1_1/dw4v5axnj/image/upload",file)
                
               



                console.log("my data",data);
                
                
                return "finish!";
                }catch(err){
                 return new Error(err)
             }
             
                



            },


            addItemImage: async (_,{accountId, itemId, imageURL},context) => {

                    try{
                           
                        const account = await Account.findById(accountId)

                        if(account){
                            const item = account.list.filter(item => item._id == itemId)
                            if(item){
                                console.log(item);
                                item[0].media = imageURL
                               
                               await account.save();
    
                               return true;
                            }  
                           
                        }else{
                            return false
                        }

                    }catch(err){
                        console.log(err);
                        return false;
                    }
            },



            deleteItemImage: async (_,{accountId, itemId},context) => {

               
                try{
                       
                    const account = await Account.findById(accountId)

                    if(account){
                        
                        const item = account.list.filter(item => item._id == itemId)
                        const username = context.req.user.username
                        
                       
                        if(item){
                            const path = `Users/${username}/myAccounts/${accountId}/${itemId}` 
            
                            const publicId = item[0].media.split('/Users').reverse()[0].split('.')[0]
                            
                             item[0].media = ''
                           
                           await cloudinary.uploader.destroy("Users"+publicId,{invalidate:true});
                           await cloudinary.api.delete_folder(path)
                          
                          await account.save();

                           return true;
                        }  
                       
                    }else{
                        return false
                    }

                }catch(err){
                    console.log(err);
                    return false;
                }
        }




            
    },


    Query:{
 

            getUserAccounts: async (_,__,context) => {
                 
                
                 const userId = context.req.user.id;
                
                try{
                    const accounts = await Account.find({owner:userId})
                
                    if(accounts){
                        return accounts.reverse();
                    }
                }catch(err){
                     console.log(err);
                }
                

                
            },

            getUserAccount: async (_,{accountId},context) => {
                 
                
                const userId = context.req.user.id;
               
               try{
                   const account = await Account.findById(accountId)
               
                   if(account){
                       return account;
                   }else{
                    throw new Error('Account not found!')}
               }catch(err){
                throw new Error(err)
               }
               

               
           },



    },

    Subscription:{
        getallitems:{
           subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator('user1')
             
        }
    }
  


}