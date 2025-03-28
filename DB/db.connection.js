import mongoose from "mongoose"; 

const mongodbConnection = async()=>{

    try{
        const mongoInstance = await mongoose.connect(process.env.URl, {
            dbName:"todoDB"
        })
        console.log(`MongoDB connected successfully!`);
    }
    catch(err){
        console.log("MongoDB conection error");
        process.exit(1);
    }
    
}
