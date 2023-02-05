const express = require("express")
const collection = require("./mongo")
const cors = require("cors")
const bcrypt=require("bcrypt")
const app = express ()
app.use(express.json())
app.use(express.urlencoded ({ extended: true }))
app.use (cors())
app.get("/login", cors (), (req, res) =>{
})
app.post ("/login", async (req, res)=>{
    const {email, password}=req.body

    try{
        const check = await collection.findOne ({email:email})
        if (check){
            const isMatch = await bcrypt.compare(password, check.password);
            console.log(isMatch)
            if (isMatch) {
                res.json("exist")
            } else {
                res.json("notexist")
            }
        }else{
            res.json("notexist")
        }
    }
    catch(e){
        res.json("notexist")
    }
})
app.post ("/signup", async (req, res, next)=>{
    const {email, password}=req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data={
        email:email,
        password:hashedPassword
    }
    try{
        const check = await collection.findOne ({email:email})
        if (check){
            res.json("exist")
        }else{
            res.json("notexist")
            await collection.insertMany([data])
        }
    }
    catch(e){
        next(e)
        res.json("notexist")
    }
})

app.listen(8000,()=>{
    console.log("port connected");
})