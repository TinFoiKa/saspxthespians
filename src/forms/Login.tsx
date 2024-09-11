import { useState } from "react"
import hasher from "../handlers/crypt"
import "./Login.css"

const Login = () => {
    const [info, setInfo] = useState({
        email: "",
        password: "",
        hash: ""
    })

    const [data, setData] = useState({
        hashed: ""
    })

    const trackChange = (event) => {
        const {id, value} = event.target

        // modify only changed values
        setInfo((prevInfo) => ({
            ...prevInfo,
            [id] : value
        }))
    }

    const authenticate = () => {
        const pass = new hasher(info.password)
        const hash = pass.bCrypt()
        
        setInfo((prevInfo) => ({
            ...prevInfo,
            hash: hash
        }))
        // database get


        if (info.hash === data.hashed) {
            // check to clear pass, allow movement on with perms.
        }

    }

    return (
        <>
            <div className="route" id="welcome"></div>
                <div id="app">
                <div className="app-view">  
                    <header className="app-header">
                    <image></image>
                    </header>
                    <input type="email" value = {info.email} onChange = {trackChange} required pattern=".*\.\w{2,}" placeholder="Email" />
                    <input type="password" value = {info.password} onChange = {trackChange} required placeholder="Password" />
                    <a onClick={authenticate} className="app-button">Login</a>
                </div>
            </div>
        </>
    )
}

export default Login