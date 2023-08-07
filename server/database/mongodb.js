import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const name=process.env.USER;
const pass=process.env.PASS;



const url=`mongodb+srv://${name}:${pass}@cluster0.n7io8h3.mongodb.net/?retryWrites=true&w=majority`


export default async function database(){
await mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("db connected");
})
.catch(err=>{
    throw err;
})



}