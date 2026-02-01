const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//temp history storage
let history = [];

//save calc
app.post("/save", (req,res) =>{
    const {expression, result} = req.body;
    if(!expression || !result ){
        return res.status(400).send("Invalid data");
    }

    history.unshift({expression,result});
    if(history.length>20){
        history.pop();
    }
    res.send("Saved");
})

//get history
app.get("/history", (req, res) => {
    res.json(history);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});