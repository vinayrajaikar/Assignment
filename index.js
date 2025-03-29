import express from 'express';
import bodyParser from 'body-parser'
import { mongodbConnection } from './DB/db.connection.js';
import { loginUser, logoutUser, registerUser } from './DB/controllers/user.controller.js';
import { verifyJwt } from './DB/middlewares/verifyJwt.js';
import cookieParser from "cookie-parser";
import { Todo } from './DB/models/todo.model.js';
import mongoose from 'mongoose';


const app=express()
app.use(bodyParser.json());
app.use(cookieParser());

mongodbConnection();

app.get('/',(req,res)=>{
    res.send("Working");
})

// app.get('/jwt',verifyJwt)

app.post('/register-user',registerUser);

app.post('/login-user',loginUser);

app.get('/logout-user',logoutUser);

app.post('/add-todo',verifyJwt,async(req,res)=>{
    const user = req.user;

    const {todo}=req.body;

    if(!todo){
        return res.status(404).send({
            message:"provide todo for adding",
        })  
    }

    const created_todo =await Todo.create({
        todo,
        user:user._id
    })

    if(!created_todo){
        return res.status(404).send({
            message:"failed to create todo",
        }) 
    }

    res.status(200).send({
        message:"Todo added successfully.",
        todo:created_todo
    })
});

app.get('/get-all-todos',verifyJwt,async(req,res)=>{
    const user=req.user;

    const todos =await Todo.find({
        user:user._id
    })

    if(!todos){
        return res.status(400).send({
            message: "Todos not found"
        })
    }

    return res.status(200).send({
        message: "Todos found ",
        todos
    })
});

app.get('/get-todo/:id',verifyJwt,async(req,res)=>{
    const {id}=req.params;

    if(!id){
        res.status(404).send({
            message:"Provide id",
        })
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if(!isValid){
        return res.status(404).send({
            message:"Invalid id"
        })
    }

    const todo = await Todo.findById({
        _id:id
    })

    console.log(todo);

    if(!todo){
        return res.status(400).send({
            message:"todo not found",
        })
    }

    return res.status(200).send({
        message:"Todo found",
        todo
    })
});

app.put('/update-status/:id',async(req,res)=>{
    const {id} = req.params;

    if(!id){
        return res.status(400).send({
            message:"provide todo id"
        })
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if(!isValid){
        return res.status(400).send({
            message:"Invalid id"
        })
    }

    const todo = await Todo.findById({
        _id:id
    }).select("status")

    if(!todo){
        return res.status(400).send({
            message: "todo not found",
        })
    }

    let status = todo.status;

    if(!status){
        return res.status(400).send({
            message:"Todo not found"
        })
    }

    if(status=="Incompleted"){
        status="Completed"
    }
    else{
        status="Incompleted"
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        {_id:id},
        { $set:{status:status}},
        { new:true}
    )

    if(!updatedTodo){
        return res.status(400).send({
            message:"Failed to update status"
        })
    }

    return res.status(200).send({
        message:"Status updated successfully",
        status
    })

});

app.delete('/delete-todo/:id',verifyJwt,async(req,res)=>{
    const {id} = req.params;

    if(!id){
        res.status(404).send({
            message:"Provide id",
        })
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if(!isValid){
        return res.status(400).send({
            message:"Invalid id"
        })
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if(!deletedTodo){
        return res.status(400).send({
            message:"Failed to delete todo"
        })
    }

    return res.status(200).send({
        message:"Todo deleted successfully!",
        deletedTodo
    })

});

app.listen(3000)
