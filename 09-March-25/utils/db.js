import mongoose from "mongoose";

//although not required but some library reqire to import dotenv
import dotenv from "dotenv"
dotenv.config()
//this can also be made an iffy in index.js
const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('Successfully connected')
    })
    .catch((err)=>{
        console.log('Failed to connect to MONGO DB', err);
    })
    .finally()
}

export default db;