import mongoose from "mongoose";


 export  const user= mongoose.model('user' , new mongoose.Schema({
    username:String,
    email:String,
    password:String
})) 



export  const playlist= mongoose.model('playlist' , new mongoose.Schema({
    name:String,
    username:String,
    isPublic: Boolean,
  movies: [
    {
        name:String,
        poster:String,
      
      
    }
  ]
})) 





