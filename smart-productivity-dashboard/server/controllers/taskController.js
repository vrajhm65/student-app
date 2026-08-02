let tasks = [{
id :1,
title: "learn express",
completed: false
}];
const getTasks=(req, res) =>{
    res.json(tasks);
};

module.exports={
    getTasks
};

