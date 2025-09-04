import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";

import con from "./utils/createConnection.js";
import listAllPrivateRepos from "./utils/Github_to_CSV.js";

const app = express();

 
dotenv.config();
 
const port = 3000;
 
app.use(cors());
app.use(express.json());
 
 
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE testDB", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });
 
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   let sql = `CREATE TABLE customers (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name TEXT,
//         status VARCHAR(100),
//         amount DECIMAL(10,2),
//         date DATE)`;
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });
 
// con.connect(async function (err) {
//   if (err) throw err;
//   console.log("Connected!");

//   const all = await listAllPrivateRepos(); 
//     const values = all.map(repo => [
//     repo[0],                          
//     repo[1],                         
//     repo[2].replace("T", " ").replace("Z", ""), 
//     repo[3],                           
//     repo[4]                           
//   ]);
//   let sql = "INSERT INTO Repos (name, url, lsUpdate, owner, lang) VALUES ?";

//   con.query(sql, [values], function (err, result) {
//     if (err) throw err;
//     console.log("Number of records inserted: " + result.affectedRows);
//   });
// });
 
app.get("/customers", (req, res) => {
    try {
        con.connect(function (err) {
            if (err) throw err;
            con.query("SELECT * FROM Repos", function (err, result) {
                if (err) throw err;
                res.json(result);
            });
        });
    }catch(err){
        res.json(err);
    }
})
 
app.delete("/customers", (req, res) => {
    try {
        const ids = req.body.ids;
        console.log(ids);
        const q = `DELETE FROM Repos WHERE id IN (${ids.join(",")})`;
 
        con.connect(function (err) {
            if (err) throw err;
            con.query(q, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
                res.json(result.affectedRows + " deleted succesfully!");
            });
        })
    } catch (err) {
        res.json(err);
    }
});
 
app.use("/",(req,res)=>{
    res.json({error : "Route not found"});
});
 
app.listen(port, () => {
    console.log("Connection successfully");
});