const express=require("express"); // imports express
const router=express.Router(); //  each feature gets own router i.e mini router

const{ getTasks }= require("../controllers/taskController"); // imports get tasjs function from controller folder

router.get("/",getTasks);
module.exports=router;