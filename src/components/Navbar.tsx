import { useNavigate } from "react-router-dom"

import "./Navbar.css"
import { useState , useEffect } from "react"

const Navbar = (props: { permissions: boolean }) => {
    const [login, setLogin] = useState({})

    const navigate = useNavigate()
    if (props.permissions == true) {
        const secret = document.getElementById("restricted") || document.createElement("div")
        secret.removeAttribute("hidden")
    }

    useEffect(
        () => {
            setLogin(false)
        }
    , [])
        
    return (
        <>
            <nav>
        <div id="logo" className = "logo" onClick = {() => navigate("")} >Your Logo here</div>

        <label htmlFor="drop" className="toggle">Menu</label>
        <input type="checkbox" id="drop" />
            <ul className="menu">
                <li><a href="#" onClick = {() => navigate("")}>Home</a></li>
                {login ? <li>
                    <label htmlFor="drop-1" className="toggle">Members + Apprentices</label>
                    <a>Members + Apprentices</a>
                    <input type="checkbox" id="drop-1"/>
                    <ul>
                        <li><a href="#">Roster</a></li>
                        <li><a href="" onClick = {() => navigate("points")}>Points</a></li>
                        <li><a href="">Other Forms</a></li>
                    </ul> 

                </li>: <></>}

                {props.permissions ? <li>
                <label htmlFor="drop-2" className="toggle">Officer +</label>
                <a href="#">For Officers</a>
                <input type="checkbox" id="drop-2"/>
                <ul>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Notion</a></li>
                    <li><a href="#/officers" >Control Panel</a>
                    </li>
                </ul>
                </li> : <></>}
                <li><a href="#">Feedback</a></li>
                <li><a href="#">Contact</a></li>

                {login ? <></> : <li><a href = "#/login">Login</a></li>}

                <li>
                <a href="#"><img src = "../assets/settings.svg"></img></a>
                <input type="checkbox" id="drop-3"/>
                <ul>
                    <li><a href="#">Settings</a></li>
                    <li><a href="" onClick = {() => navigate("officers")}>Logout</a>
                    {/*<label htmlFor="drop-3" className="toggle">Tutorials +</label>
                    <a href="#">Tutorials</a>         
                    <input type="checkbox" id="drop-3"/>

                    <ul>
                        <li><a href="#">HTML/CSS</a></li>
                        <li><a href="#">jQuery</a></li>
                        <li><a href="#">Other</a></li>
                    </ul>*/}
                    </li>
                </ul></li>
            </ul>
        </nav>
        </>
    )

}


export default Navbar