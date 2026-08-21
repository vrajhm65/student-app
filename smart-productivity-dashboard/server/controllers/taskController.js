const Task = require("../models/task");
let tasks = [];

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
};
const getTaskById =(req, res)=>{

    const taskId = Number(req.params.id); // rreq params id reffers to "5" if url is /api/tasks/id. notice its a string and convert into number
    const task = tasks.find(task => task.id ===taskId); // searches the array and returns first matching task

    if(!task){
        return res.status(404).json   // 404 if no task exists meanas request task not found 
        ({
            message: "Task not found"
        });
    }
    res.json(task);
};
const createTask = async (req, res) => {
    try {
        const newTask = await Task.create({
            title: req.body.title,
            completed: false
        });

        res.status(201).json({
            message: "Task added successfully",
            task: newTask
        });
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
};

const updateTask=(req, res)=>{

   const taskId=Number(req.params.id);
   const task = tasks.find(task=> task.id ===taskId);

   if(!task){
    return res.status(404).json({
        message:"TASK NOT FOUND"
    });
   }
   task.title=req.body.title ?? task.title; // if new title is provided updte it .or keep old one
   task.completed= req.body.completed ?? task.completed;

   res.json({
    message:"Task updated succesfully",
    task

   });

};

const deleteTask = (req, res) => {
    const taskId = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === taskId);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully"
    });
};


module.exports={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};

