
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();//craeted app
app.use(cors());// then used middleware
app.use(express.json());

//db connecting
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"@vrajhm6547#",
    database:"student_app"
});

db.connect(err=>{
    if(err){
        console.log("db error:",err.message);
    }else{
        console.log("database connected");
    }
});

//test route
app.get("/",(req ,res)=>{
    res.send("server working");  // this 3 line  part creates rute (url)
});
//start server
app.listen(3000,()=>{
    console.log("server running on port 3000");
});
//inserts data
app.post("/add-student",(req,res)=>{
    const{ name, usn, branch, }=req.body;
    const sql="insert into students(name,usn,branch) values(?,?,?)";
    db.query(sql,[name,usn,branch],(err,result)=>{
        if(err){
          if (err.code==="ER_DUP_ENTRY"){
            return res.send("USN aldready exists");
          }
            console.log(err);
            return res.send("error adding student");
            }

       res.send("student added successfully");
    });
});

//for testing purpose
app.get("/test-add",(req,res)=>{
     const sql="insert into students(name,usn,branch) values('vinay','1st24is014','ise')";
     db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            return res.send("error");
        }
        res.send("test student added successfully");
     });
});
//createing get api
app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error fetching data");
    }
    res.json(result);
  });
});
//backend deleteing
app.delete("/delete-student/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error deleting student");
    }
    res.send("Student deleted");
  });
});

//update in backend
app.put("/update-student/:id", (req, res) => {
  const id = req.params.id;
  const { name, usn, branch} = req.body;

  const sql = "UPDATE students SET name=?, usn=?, branch=? WHERE id=?";

  db.query(sql, [name, usn, branch, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error updating");
    }
    res.send("Student updated");
  });
});  
app.post("/login",(req,res)=>{
  const {usn,password,branch}=req.body;
  const sql="select* from students where usn=? and password=? and branch=?";
  db.query(sql,[usn],(err,result)=>{
    if(err) return res.send("error");
    if(result.length>0){
      if(result[0].password===password){
        res.json({
          message:"login succesful",
        user:result[0]
      });
      }else{
        res.json("wrong password");
      }
    }
    else{
      const insertsql="insert into students (usn,password) values (?,?)";
    db.query(insertsql,[usn,password],(err2,result2)=>{
      if (err2) return res.send("error registering");
    res.json("registerd and logged in");
      });
    }
  });
});
app.post("/update-profile",(req,res)=>{
  const{usn,name,branch}=req.body;
  const sql="update students set name=?, branch=? where usn=?";
  db.query(sql,[name,branch,usn],(err,result)=>{
    if(err)return res.send("error updating profile");
    res.json("profile updated")
  });
});