const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {UserInputError} = require("apollo-server")
const {validatorsRegisterInput, validateLoginInput} = require("../../util/validators")
const {SECRET_KEY} = require("../../credentials.json")

const {auth} = require("../../firebase")


 async function ifUserLoggedin(){
     let userIsConnected = {};
    await auth.onAuthStateChanged(user => user ? userIsConnected.email = user.email : userIsConnected.email = null )
    
    return userIsConnected.email
}


function generateToken(user){
  return jwt.sign({
        id: user._id,
        email:user.email,
        username:user.username,
        },SECRET_KEY,{expiresIn:'1h'});
}


module.exports = {
    Mutation:{
        async login(_,{username,password}, {res,id}){
            let userDetails = null;
            console.log(id);
            const {errors, valid} = validateLoginInput(username, password)
            if(!valid){
                throw new UserInputError("Errors",{errors})  
             }
             const user = await User.findOne({username})
            
           if(!user){
                errors.general = 'User not found';
                throw new UserInputError("user not found!",{errors})
            }
            
            try{
                userDetails = await auth.signInWithEmailAndPassword(user.email, password)
            }catch(err){
                errors.general = err.code;
                throw new UserInputError(`${err.code}`,{errors})
            }
           
            
            if(!userDetails){
                errors.general = 'Bad credentials!';
                throw new UserInputError("'Bad credentials!'",{errors}) 
            }
            const match = await bcrypt.compare(password, user.password)
            
             if(!match && userDetails){
                user.password =  await bcrypt.hash(password, 12);
                await user.save()
               
             }else if(!match){
                 
                 errors.general = 'Wrong credentials!';
                 throw new UserInputError("Wrong credentials!",{errors})
               
             }
            
             

             const token = generateToken(user);
         
             res.cookie("id", token, {
                 httpOnly:true,
                 secure:false,
                 maxAge:1000 * 60 * 60 * 24 * 7 // 7 days    

             });
                
           
             return {...user._doc, id: user._id,token, firebase_user_id:userDetails.user.uid}
        },
        
        async register(_,
            {registerInput:{
                username,
                email,
                password,
                confirmPassword},
            
          
        },context,info){
       
            const userF = null;
        const {errors, valid} = validatorsRegisterInput(username,email,password,confirmPassword)
        if(!valid){
            throw new UserInputError('Errors',{errors});
        }   
        const user = await User.findOne({username})
           if(user){
             throw new UserInputError("User name is already taken",{
                 errors:{
                     username:'This username is already taken'
                 }
             })
           }
      


          

            password = await bcrypt.hash(password, 12);
            
            try{
                userF = await auth.createUserWithEmailAndPassword(email,confirmPassword)
            }catch(err){
                errors.general = err.code;
                console.log(err);
                throw new UserInputError(`${err.code}`,{errors})
            }


            const newUser = new User({
                email,
                username,
                password,
                confirmPassword,
                firebase_user_id:userF.user.uid,
            });

           const res = await newUser.save();
           
            const token = generateToken(res)
               
                return {...res._doc, id: res._id, token, firebase_user_id:userF.user.uid }
        }, 


        


            async resetPassword(_,{email}){
                try{
                    
                    const res =  await User.findOne({email})
                    let msg = "check your inbox mail to change the password!"
                   
                   await auth.sendPasswordResetEmail(email);
                  
                       return {msg:msg}
                 
                   
                }catch(err){
                    console.log(err);

                }
            }


        

       },


       Query:{
        async getUserState(_,__,context){
            let InitialState = {
                email:null,
                uid:null,
                username:null,

            } 
          
            try{        
        const ifUserConnected = await ifUserLoggedin()
              console.log("firebase login",ifUserConnected);    
            if(ifUserConnected){
                context.res.cookie("id2", context.req.user.id, {
                    httpOnly:false,
                    secure:false,
                    maxAge:1000 * 60 * 60 * 24 * 7 // 7 days    
   
                });  
                return {...context.req.user}
            }else{
                context.res.clearCookie("id");
                context.res.clearCookie("id2");
               return null;
               
              
            }
          
               
              
           }catch(err){
                console.log(err);
            }
          
           },
       }

}