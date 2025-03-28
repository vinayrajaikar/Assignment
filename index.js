import express from 'express';
import bodyParser from 'body-parser'
import { mongodbConnection } from './DB/db.connection.js';
import { loginUser, registerUser } from './DB/controllers/user.controller.js';
import { verifyJwt } from './DB/middlewares/verifyJwt.js';
import cookieParser from "cookie-parser";

const app=express()
app.use(bodyParser.json());
app.use(cookieParser());

mongodbConnection();

const todos=[
    {
        id:1,
        todo:"write a article",
        status: "Completed"
    },
    {
        id:2,
        todo: "Complete the Assignment",
        status: "Incompleted"
    }
];

app.get('/',(req,res)=>{
    res.send("Working");
})

// app.get('/jwt',verifyJwt)

app.post('/register-user',registerUser)

app.post('/login-user',loginUser);

app.post('/add-todo',(req,res)=>{
    const {id,todo}=req.body;
    if(!id || !todo){
        res.status(404).send({
            message:"provide id and todo for updating",
        })  
    }
    todos.push({
        id,
        todo,
        status:"Incompleted"
    })
    res.status(200).send({
        message:"Todo added successfully.",
        todos:todos
    })
})

app.get('/get-all-todos',(req,res)=>{
    res.json(todos);
})

app.get('/get-todo/:id',(req,res)=>{
    const {id}=req.params;
    if(!id){
        res.status(404).send({
            message:"Provide id",
        })
    }

    todos.map((todo)=>{
        if(todo.id==id){
            res.status(200).send({
                message:"todo data fetched successfully",
                data:todo
            })
        }
    })
    res.status(404).send({
        message:"Invalid id",
    })
})

app.put('/update-status/:id',(req,res)=>{
    const {id} = req.params;

    if(!id){
        res.status(404).send({
            message:"Provide id",
        })
    }

    todos.map((todo)=>{
        if(todo.id==id){
            if(todo.status=="Completed"){
                todo.status="Incompleted"
                
                res.status(200).send({
                    message:"status updated",
                    status:"Incompleted",
                })
            }
            else{
                todo.status="Completed"

                res.status(200).send({
                    message:"status updated",
                    status:"Completed",
                })
            }
        }
    })

    res.status(404).send({
        message:"Invalid id",
    })

})

app.delete('/delete-todo/:id',(req,res)=>{
    const {id} = req.params;

    if(!id){
        res.status(404).send({
            message:"Provide id",
        })
    }

    const index=todos.findIndex((todo)=> todo.id==todo);
    if(index){
        todos.splice(index,1);
        res.status(200).send({
            "message": "todo deleted successfully"
        })
    }

    res.status(404).send({
        message:"Invalid id",
    })
})

app.listen(3000);
