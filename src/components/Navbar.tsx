import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import "./Navbar.css"
import { useEffect, useState } from "react"

import menu from  "../assets/menu"
import settings from "../assets/settings"

const Navbar = () => {
    const [perms, setPerms] = useState(0)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cookie, setCookie, removeCookie] = useCookies(['auth'])

    const navigate = useNavigate()

    useEffect(() => {
        const updatePermissions = () => {
            const auth = cookie.auth

            if (auth){
                const login = auth
                setPerms(login.perms)
            }  
            else{
                setPerms(0)
            }
                
        }
        
        updatePermissions()
    }, [cookie.auth])

    const logout = () => {
        removeCookie('auth')
    }

    const moveHandle = (location: string) => {
        const largeDrop = document.getElementById("drop");
        (largeDrop as HTMLInputElement).checked = false;
        console.log((largeDrop as HTMLInputElement).checked)
        navigate(location)
        
    }
        
    return (
        <>
            <nav>
        <div id="logo" className = "logo" onClick = {() => moveHandle("")} >Your Logo here</div>

        <label htmlFor="drop" className="toggle">{menu()}</label>
        <input type="checkbox" id="drop" />
            <ul className="menu">
                <li><a href="#" onClick = {() => moveHandle("")}>Home</a></li>
                <li><a href="#">Shows</a></li>
                {perms > 0 ? <li>
                    <label htmlFor="drop-1" className="toggle">Members + Apprentices</label>
                    <a>Members + Apprentices</a>
                    <input type="checkbox" id="drop-1"/>
                    <ul>
                        <li><a href="#">Roster</a></li>
                        <li><a href="#/points" onClick = {() => moveHandle("points")}>Points</a></li>
                        <li><a href="#/upload/writing" onClick = {() => moveHandle("upload/writing")}>Your Writing</a></li>
                    </ul> 

                </li>: <></>}

                {perms == 3 ? <li>
                <label htmlFor="drop-2" className="toggle">Officer +</label>
                <a href="#">For Officers</a>
                <input type="checkbox" id="drop-2"/>
                <ul>
                    <li><a href="https://www.notion.so/Documentation-8f8905f737cb473b9084d59177616922">Documentation</a></li>
                    <li><a href="https://www.notion.so/Thespians-Officer-Hub-45b2d5fc4a8c4234bfc42bffa6500139">Notion</a></li>
                    <li><a href = "#/upload/video">Upload Videos</a></li>
                    <li><a href="#/officers" >Control Panel</a></li>
                    <li><a href="#/officers/report-attendance">Attendance</a></li>
                </ul>
                </li> : <></>}
                <li><a href="#">Feedback</a></li>
                <li><a href="#">Contact</a></li>

                {perms > 0 ? <></> : <li><a href = "#/login">Login</a></li>}

                <li>
                <a href="#">{settings()}</a>
                <input type="checkbox" id="drop-3"/>
                <ul>
                    <li><a href="#/settings" onClick = {() => moveHandle("settings")}>Settings</a></li>
                    {perms > 0 ? <li><a href="" onClick = {logout}>Logout</a></li>: <></>}
                    {/*<label htmlFor="drop-3" className="toggle">Tutorials +</label>
                    <a href="#">Tutorials</a>         
                    <input type="checkbox" id="drop-3"/>

                    <ul>
                        <li><a href="#">HTML/CSS</a></li>
                        <li><a href="#">jQuery</a></li>
                        <li><a href="#">Other</a></li>
                    </ul>*/}
                    
                </ul></li>
            </ul>
        </nav>
        </>
    )

}


export default Navbar