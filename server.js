
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
app.post("/login", (req, res) => {
  const { usn, password } = req.body;

  db.query("SELECT * FROM students WHERE usn=?", [usn], (err, result) => {

    if (err) {
      console.log(err);
      return res.json({ message: "Server error" });
    }

    if (result.length > 0) {

      if (result[0].password === password) {
        return res.json({ message: "Login successful", user: result[0] });
      } else {
        return res.json({ message: "Wrong password" });
      }

    } else {

      db.query(
        "INSERT INTO students(usn,password) VALUES(?,?)",
        [usn, password],
        (err2) => {
          if (err2) {
            console.log(err2);
            return res.json({ message: "Error registering" });
          }
          return res.json({ message: "Registered and logged in" });
        }
      );

    }
  });
});
app.post("/update-profile",(req,res)=>{
  const{usn,name,branch}=req.body;
  const sql="update students set name=?, branch=? where usn=?";
  db.query(sql,[name,branch,usn],(err,result)=>{
    if(err)return res.send("error updating profile");
    res.json("profile updated successfully");
  });
});
//getting all students from database
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});
//attendemce(mark with passkey)
const faculty_key="admin123";
app.post("/mark-attendance", (req, res) => {
  const { records, subject, passkey } = req.body;

  if (passkey !== "admin123") {
    return res.json({ message: "Unauthorized " });
  }

  const date = new Date().toISOString().split("T")[0];

  records.forEach(r => {
    db.query(
      "INSERT INTO attendance (usn, subject, date, status) VALUES (?, ?, ?, ?)",
      [r.usn, subject, date, r.status]
    );
  });

  res.json({ message: "Attendance marked successfully " });
});
//view attendance
app.get("/view-attendance/:usn", (req, res) => {
  const usn = req.params.usn;
  const sql = "SELECT * FROM attendance WHERE usn=? order by date desc";
  db.query(sql, [usn], (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }
    res.json(result);
  });
});
//attendance per subject
app.get("/attendance/:usn/:subject", (req, res) => {
  const { usn, subject } = req.params;
  const sql = "SELECT * FROM attendance WHERE usn=? AND subject=? ORDER BY date DESC";
  db.query(sql, [usn, subject], (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }
    res.json(result);
  });
});
//add subject api
app.post("/add-subject", (req, res) => {
  const { subject_name, subject_code } = req.body;

  const sql = "INSERT INTO subjects (subject_name, subject_code) VALUES (?, ?)";

  db.query(sql, [subject_name, subject_code], (err) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Error adding subject" });
    }

    res.json({ message: "Subject added successfully " });
  });
});
//get sub api
app.get("/subjects", (req, res) => {
  db.query("SELECT * FROM subjects", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});
//delete subject api
app.delete("/delete-subject/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM subjects WHERE id = ?", [id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Error deleting subject" });
    }

    res.json({ message: "Subject deleted successfully " });
  });
});
//getting marks api
app.get("/marks-data", (req, res) => {
  db.query("SELECT * FROM students", (err, students) => {
    if (err) return res.json({ students: [], subjects: [] });
    
    db.query("SELECT * FROM subjects", (err, subjects) => {
      if (err) return res.json({ students, subjects: [] });
      res.json({ students, subjects });
    });
  });
});
//save marks api
app.post("/save-marks", (req, res) => {
  const{data}=req.body;
  data.forEach(item=>{
    db.query(
      "INSERT INTO marks (usn, subject, marks) VALUES (?, ?, ?)",
      [item.usn, item.subject, item.marks]
    );
  } );
  res.json({ message: "Marks saved successfully" });
}); 
// view marks api
app.get("/view-marks/:usn", (req, res) => {
  const usn = req.params.usn;
  const sql = `SELECT subject, marks FROM marks WHERE usn=?`;
  db.query(sql, [usn], (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});
//student dashboard api
app.get("/student-profile/:usn", (req, res) => {
  const usn = req.params.usn;

  // student info
  db.query("SELECT * FROM students WHERE usn = ?", [usn], (err, student) => {
    if (err) return res.json({});

    // attendance
    db.query("SELECT subject, status FROM attendance WHERE usn = ?", [usn], (err, attendance) => {

      // marks
      db.query("SELECT subject, marks FROM marks WHERE usn = ?", [usn], (err, marks) => {

        res.json({
          student: student[0],
          attendance,
          marks
        });

      });

    });
  });
});