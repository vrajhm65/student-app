const Task = require("../models/task");
let tasks = [];

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        const formattedTasks = tasks.map((task) => ({
            id: task._id.toString(),
            title: task.title,
            completed: task.completed
        }));

        res.json(formattedTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            id: task._id.toString(),
            title: task.title,
            completed: task.completed
        });

    } catch (error) {
        console.error("Error fetching task:", error);

        res.status(500).json({
            message: "Failed to fetch task"
        });
    }
};

const createTask = async (req, res) => {
    try {
        const newTask = await Task.create({
            title: req.body.title,
            completed: false
        });

       res.status(201).json({
    message: "Task added successfully",
    task: {
        id: newTask._id.toString(),
        title: newTask.title,
        completed: newTask.completed
    }
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

