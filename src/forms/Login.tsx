import { ChangeEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { databaseQuery } from "../handlers/notion-handler"
import { useCookies } from "react-cookie"
import "./Login.css"
import "./Points.css"

const Login = () => {
    const navigate = useNavigate()
    
    const [cookie, setCookie, removeCookie] = useCookies(['auth'])

    const [info, setInfo] = useState({
        email: "",
        password: "",
        hash: "",
        perms: 0,
        grade: "",
        store: false,
    })

    const firstTrack = () => {
        const inputs : HTMLInputElement[] = document.getElementsByClassName("info")

        for (let i = 0; i < inputs.length; i++){
            const input = inputs[i]
            trackChange(input)
        }
    }
    
    const trackChange = (event: ChangeEvent<HTMLInputElement> | HTMLInputElement) => {
        console.log(typeof event)
        const {id, value} = (event as ChangeEvent<HTMLInputElement>).target ? (event as ChangeEvent<HTMLInputElement>).target : {id: 0, value: false}

        // check the case that it is a checkbox
        let checked
        if ((event as HTMLInputElement).type == "checkbox") {
            checked = (event as HTMLInputElement).checked
        }
        
        const modification = checked || value
        // modify only changed values
        setInfo((prevInfo) => ({
            ...prevInfo,
            [id] : modification
        }))
        return true
    }

    const sha256 = async (string: string) => {
        const utf8 = new TextEncoder().encode(string);
        return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
          return hashHex;
        });
      }
    
    const setHash = async () => {
        const text = info.password
        const cipher = await sha256(text)
        
        console.log(cipher)
        setInfo((prevInfo) => ({
            ...prevInfo,
            hash: cipher
        }))
    }

    useEffect(() => {
        if (info.hash) {
            authenticate()
        }
    })

    const login = async () => {
        await setHash()
    }

    const authenticate = async () => {

        console.log(info.hash)
        //! info.hash is not updating

        // database get
        const database = "b767e5f4b1b24a07b72684aae893453b"
        //const query = new databaseQuery("{Email is_" + info.email + "}", database)
        const query = new databaseQuery("{Email is_" + info.email + "}", database)
        const data = await (await query.execute()).json()

        console.log(data)
        // manually do the filter here until the notion API issue is resolved
        const notionHash = data.results[0].properties['Return'].formula.string

        console.log(info.hash, notionHash)

        if (info.hash == notionHash) {
            // expiration of cookie in case the user does not wish to store their info
            const expiration = new Date();
            expiration.setTime(expiration.getTime() + (24*60*60*1000));

            // check to clear pass, allow movement on with perms.
            const role = data.results[0].properties['Role'].select.name

            let permNumber = 0
            switch(role) {
                case("Officer"):
                    permNumber = 3;
                    break;
                case("Member"):
                    permNumber = 2;
                    break;
                case("Apprentice"):
                    permNumber = 1;
                    break;
                default: 
                    permNumber = 0;
            }  
            const allowed = {email: info.email, hash: info.hash, perms: permNumber, grade: info.grade}
            
            // store user data in a cookie
            setCookie("auth", allowed)
            navigate("../", { replace : true })
        }
    

    }

    return (
        <>
            <div className="route" id="welcome"></div>
                <div id="app" onLoad={firstTrack}>
                <div className="app-view" >  
                    <header className="app-header">
                    <image></image>
                    </header>
                    <input className = "info" id = "email" type="email" value = {info.email} onChange = {trackChange} required pattern=".*\.\w{2,}" placeholder="Email" />
                    <input className = "info" id = "password" type="password" value = {info.password} onChange = {trackChange} required placeholder="Password" />
                    
                    
                    <div className="formbold-checkbox-wrapper store">
                    <label htmlFor="store" className="formbold-checkbox-label">
                    <div className="formbold-relative">
                        <input
                        type="checkbox"
                        id="store"
                        className="formbold-input-checkbox info"
                        />
                        <div className="formbold-checkbox-inner">
                        <span className="formbold-opacity-0">
                            <svg
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            className="formbold-stroke-current"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M8.81868 0.688604L4.16688 5.4878L2.05598 3.29507C1.70417 2.92271 1.1569 2.96409 0.805082 3.29507C0.453266 3.66742 0.492357 4.24663 0.805082 4.61898L3.30689 7.18407C3.54143 7.43231 3.85416 7.55642 4.16688 7.55642C4.47961 7.55642 4.79233 7.43231 5.02688 7.18407L10.0696 2.05389C10.4214 1.68154 10.4214 1.10233 10.0696 0.729976C9.71776 0.357624 9.17049 0.357625 8.81868 0.688604Z"
                                fill="white"
                            />
                            </svg>
                        </span>
                        </div>
                    </div>
                    Would you like us to store your Login Data?
                    </label>
                </div>
                    <button onClick={login} className="app-button">Login</button>
                </div>
            </div>
        </>
    )
}

export default Login