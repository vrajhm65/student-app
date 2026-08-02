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

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
});
