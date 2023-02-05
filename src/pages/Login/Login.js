import axios from 'axios'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function Login() {
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const history = useHistory()
    async function handleSubmit(e) {
        e.preventDefault()

        try {
            axios.post("http://localhost:8000/login",{
                email,password
            })
            .then(res=>{
                console.log(res.data)
                if (res.data === "exist")
                {
                    history.push("/admin", {state: {id:email}})
                } else if(res.data === "notexist")
                {
                    console.log("user not found")
                }
        }).catch (e=>{
            alert ("wrong details")
            console.log(e)
        }) 
    }catch(e){
        console.log(e)
    }
    }
    return (
        <div>Login
            <form action= "POST">
                <input type="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Email" name="" id="" />
                <input type="password" onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password" name="" id="" />
            <input type="submit" onClick={ handleSubmit } value="log"/>
            </form>
        </div>
    )
}

export default Login