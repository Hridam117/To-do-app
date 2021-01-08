const express = require("express");
const app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
app.use("/static", express.static("public"));
const dotenv = require("dotenv"); 
dotenv.config();
const port = process.env.PORT || 3000;


const TodoTask = require("./models/todotask.js");



//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => { 
    console.log("Connected to db!"); 
    app.listen(port, () => console.log("Server Up and running"));
 });





// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {res.render("index.ejs", { todoTasks: tasks });});
});


app.post('/addtask', function (req, res) {
    res.render('index')
});

//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({content: req.body.content});try {await todoTask.save();res.redirect("/");} catch (err) {res.redirect("/");}
});

//UPDATE
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });});}).post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {if (err) return res.send(500, err);res.redirect("/");});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;TodoTask.findByIdAndRemove(id, err => {if (err) return res.send(500, err);res.redirect("/");});
});


