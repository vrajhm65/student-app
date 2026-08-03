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
    const task = tasks.find(task => task.id ===taskId);

    if(!task){
        return res.status(404).json({
            message: "Task not found"
        });
    }
    res.json(task);
}
module.exports={
    getTasks,
    getTaskById
};

