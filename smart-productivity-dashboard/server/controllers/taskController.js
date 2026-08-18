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
    const newtask={ id:tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1, 
        title: req.body.title,
        completed:  false
    };
    tasks.push(newtask);
    res.status(201).json({
        message: "task added succesfully",
        task: newtask
    });
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

