import mongoose, { model, Schema } from "mongoose";
import { Todo } from "./todo.model.js";

export const userSchema = new Schema({
    username:{
        type: String,
        require:true,
        unique: true
    },

    email:{
        type: String,
        require:true,
        unique: true
    },

    password:{
        type: String,
        required: true
    },

    todos:[{
        type: Schema.Types.ObjectId,
        ref:"Todo"
    }]
})

export const User = mongoose.model("User",userSchema);