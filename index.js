const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { getRandomValues } = require('crypto');
// const {v4 : uuidv4} = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

let port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sigma_app',
    password: "Shivu@123",
  });

  let getRandomUser = () =>{
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

// Home route
app.get("/", (req, res)=>{
    let q = "SELECT COUNT(*) FROM user";
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let count = result[0]['COUNT(*)'];
            res.render("home.ejs", {count});
        });
    }
    catch(err){
        console.log(err);
        res.send("some error in Db");
    }
});

// showUsers route
app.get("/user", (req, res)=>{
    let q = "SELECT * FROM user";
    try{
        connection.query(q, (err, users)=>{
            if(err) throw err;
            console.log(users);
            res.render("showUsers.ejs", {users});
        });
    } catch(err){
        console.log(err);
        res.send("something error in Db");
    } 
});

//Edit route

app.get("/user/:id/edit", (req, res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs", {user});
        });
    } catch(err){
        console.log(err);
        res.send("something error in Db");
    }
});

// UPDATE ROUTE (DB)
app.patch("/user/:id", (req, res)=>{
    let {id} = req.params;
    let {password : formPass, username : newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user = result[0];
            if(formPass != user.password){
                res.send("Wrong password!");
            }else{
                let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, result)=>{
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
            
        });
    } catch(err){
        console.log(err);
        res.send("something error in Db");
    }
});

//Add user 
app.get("/user/new", (req, res)=>{
    res.render("new.ejs");
});

app.post("/posts",(req, res)=>{
    let {id, username, email, password} = req.body;
    let q = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?,?)";
    try{
        connection.query(q, [id, username, email, password],(err, result)=>{
            if(err) throw err;
            res.redirect("/user");
        });
    } catch(err){
        console.log(err);
        res.send("something error in DATABASE");
    }
});


//Delete a user
app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("deleteUser.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });


  app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM user WHERE id = '${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
        });
    }catch(err){
        console.log(err);
        res.send("some error in Database");
    }
});


app.listen(port, (req, res)=>{
    console.log(`server is listening to ${port}`);
});


// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for(let i=1; i<=100; i++){
//     data.push(getRandomUser());
// }

// try{
//     connection.query(q, [data], (err, result)=>{
//         if(err) throw err;
//         console.log(result);
//     });
// }
// catch(err){
//     console.log(err);
// }

// connection.end();



