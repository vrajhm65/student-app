const express = require("express");  // importing express library
const cors = require("cors");
const app = express(); // creating express app
app.use(cors());

const PORT = 5000; // choosing port
const taskRoutes = require("./routes/taskRoutes");

app.use(express.json()); // express needs to understand the json .so it acts as a translator
app.use("/api/tasks", taskRoutes);
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
