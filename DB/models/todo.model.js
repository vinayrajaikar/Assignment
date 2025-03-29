import mongoose, { Schema } from "mongoose";

const todoSchema=new Schema({
    
    todo:{
        type: String,
        require: true
    },

    status:{
        type:String,
        default:"Incompleted"
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }

})

export const Todo = mongoose.model("Todo",todoSchema);