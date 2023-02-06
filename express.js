const express = require("express")
const collection = require("./mongo")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express ()
app.use(express.json())
app.use(express.urlencoded ({ extended: true }))
app.use (cors())
app.get("/login", cors (), (req, res) =>{
})
app.post ("/login", async (req, res)=>{
    const {email, password} = req.body
    const payload = { email:email };
    try{
        const check = await collection.findOne ({email:email})
        if (check){
            const isMatch = await bcrypt.compare(password, check.password);
            console.log(isMatch)
            if (isMatch) {
                res.status(201).json({
                    exist:"exist",
                    token: generateToken(payload)
                })
            }else{
                res.status(400)
                throw new Error ('Invalid user data')
            }
        }else{
            res.status(400)
            throw new Error ('Invalid user data')
        }
    }
    catch(e){
        res.status(400)
    }
})
app.post ("/signup", async (req, res, next)=>{
    const {email, password}=req.body
    const payload = { email:email };
    const hashedPassword = await bcrypt.hash(password, 10);
    const data={
        email:email,
        password:hashedPassword
    }
    try{
        const check = await collection.findOne ({email:email})
        if (check){
            res.status(400).json({
                exist:"exist",
                token: "null"
            })
        }else{
            res.status(201).json({
                exist:"notexist",
                token: generateToken(payload)
            })
            await collection.insertMany([data])
        }
    }
    catch(e){
        next(e)
        res.json("notexist")
    }
})
const generateToken = (payload) => {
    return jwt.sign( { payload }, "secret", { expiresIn: '30d' })
}

app.listen(8000,()=>{
    console.log("port connected");
})