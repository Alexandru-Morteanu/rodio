import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        history.push("/admin")
        } catch {
        setError("Failed to log in")
        }

        setLoading(false)
    }
    return (
        <div onSubmit={ handleSubmit }>Login
            <input type="email" ref={emailRef} required></input>
            <input type="password" ref={passwordRef} required></input>
            <button type='submit'>submit</button>
        </div>
    )
}

export default Login