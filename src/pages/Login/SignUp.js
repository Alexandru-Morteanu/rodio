import axios from 'axios'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
function Login() {
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [confirmPassword, setConfirmPassword]=useState("")
    const history = useHistory()
    async function handleSubmit(e) {
        e.preventDefault()
        if ( (password !== confirmPassword) && (password !== "")) {
          console.log("Passwords do not match");
        } else {
          try {
              axios.post("http://localhost:8000/signup",{
                  email,password
              })
              .then(res=>{
                if(res.data.exist === "exist"){
                  console.log("User already exists")
                }
                else if (res.data.exist === "notexist" ){
                  history.push("/admin", {state: {id:email}})
                }
                })
              .catch(e=>{
                  console.log("wrong details")
                  console.log(e)
              }) 
              }catch(e){
                  console.log(e)
              }
       }
  }
    return (
        <div>SignUp
            <form action= "POST">
                <input type="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Email" name="" id="" />
                <input type="password" onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password" name="" id="" />
                <input type="password" onChange={(e)=>{setConfirmPassword(e.target.value)}} placeholder="ConfirmPassword" name="" id="" />
            <input type="submit" onClick={ handleSubmit } value="log"/>
            </form>
        </div>
    )
}

export default Login