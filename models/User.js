const {model, Schema} = require("mongoose")
// mongo-db user structure
const userSchema = new Schema({
      username: String,
      password:String,
      email:String,
      firebase_user_id:String,
      profileImageUrl:String

});

userSchema.set('timestamps', true)

module.exports = model('User', userSchema);







