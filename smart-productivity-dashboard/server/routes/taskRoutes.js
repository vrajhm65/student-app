const express=require("express"); // imports express
const router=express.Router(); //  each feature gets own router i.e mini router

const{ getTasks, getTaskById }= require("../controllers/taskController"); // imports get tasjs function from controller folder

router.get("/",getTasks); // routes home path
router.get("/:id",getTaskById);
module.exports=router; //exports router to srver.js