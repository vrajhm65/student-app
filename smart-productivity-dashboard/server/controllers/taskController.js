let tasks = [{
id :1,
title: "learn express",
completed: false
}];
const getTasks=(req, res) =>{
    res.json(tasks);
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
const createTask=(req, res)=>{
    const newtask=req.body;
    tasks.push(newTask);
    res.staus(201).json({
        message: "task added succesfully",
        task: newTask
    });
};
module.exports={
    getTasks,
    getTaskById,
    createTask
};

