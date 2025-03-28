import mongoose from "mongoose"; 
import dotenv from "dotenv";

dotenv.config({
    path:'./.env'
})

export const mongodbConnection = async()=>{
    const url=process.env.URI;

    try{
        const mongoInstance = await mongoose.connect(url, {
            dbName:"todos"
        })
        console.log(`MongoDB connected successfully!`,mongoInstance.connection.host);
    }
    catch(err){
        console.log("MongoDB conection error");
        process.exit(1);
    }

}
