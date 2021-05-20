const {model, Schema} = require("mongoose")

const accountSchema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }, 
    title:String,     
    members:[{
            type:Schema.Types.ObjectId,
            ref:'users'
         }],
        
         list:[
             {
                 title:String,
                 description:String,
                 media:String,
                 amount:Number,
                 createdAt: { type: Date, default: Date.now },
                 updatedAt: { type: Date, default: Date.now }
                 }
         ],
        
})

accountSchema.set('timestamps', true)

module.exports = model('Account', accountSchema)