const express = require("express"); // importing express library
const app = express(); // creating express app
app.use(express.json()); // express needs to understand the json .so it acts as a translator
const PORT = 5000; // choosing port
let tasks=[
    {
    id: 1,
    title: "learn express",
    completed:false
}
];
app.get("/", (req, res)=>{
    res.send("Smart Productivity Dashboard Backend is running")
});

app.get("/api/tasks", (req, res)=> {
    res.json(tasks);      // here we have used res.json cuz we are sending json data not plain text
});

app.post("/api/tasks", (req, res)=> {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json({message:"Task Added Succesfully",
        task: newTask
    });
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
