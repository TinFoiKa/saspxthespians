import { ChangeEvent, useState, ReactNode } from  "react"
import "./Surfaces.css"
import { databaseWrite } from "../handlers/notion-handler";
import { types } from "../handlers/notion-handler";
import pfp from "../assets/pfp"
import { useCookies } from "react-cookie";

const Settings = () => {
    const [changes, setChanges] = useState({pass: "", prev: "", photo: "", username: "", sheetname: "", phone: ""});
    const [cookies] = useCookies(["auth"]);

    const formLocations = new Map<string, string>()
    formLocations.set("password", "Users");
    formLocations.set("photo", "Users");
    formLocations.set("sheetName", "Requests");
    formLocations.set("phone", "Users");

    const trackChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {id, value} = event.target

        setChanges((prevData) => ({
            ...prevData,
            [id] : value
        }))
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
    
    const getPhotoLink = () => {
        // get the photo from the user data
        return ""
    }

    const getInsert = () => {
        const url = getPhotoLink()
        
        const ret : ReactNode = url != "" ?
            <img src = {url} className = "images"></img>
            : 
            pfp()

        return ret
    }
    
    const confirm = async () => {
        const userdb = "Users"
        const success = document.getElementsByClassName("Success")
        for (let i = 0; i < success.length; i++){
            if(success[i]) success[i].innerHTML = "Loading..."
        }
        

        const hash = await sha256(changes.pass)
        
        // search - change
        const inputs = [{Name: "Email", Property: types.email(cookies.auth.email)},
            {Name: "Pass", Property: types.text(hash)}]
        const query = new databaseWrite(inputs, userdb)
        const response = await (await query.editRow()).json()
        console.log(response)
        if (response == "no response") {
            console.log("error: invalid inputs")
        } else {
            
            for (let i = 0; i < success.length; i++){
                if(success[i].id == "pass") success[i].innerHTML = "Successful Password Change!"
            }
        }


    }

    const request = async () => {

    }

    return (
        <>
        <div className = "editWrapper">
            <div className = "editContent">
                <div className = "section continued">
                    <div className="sectionHead">
                        Profile Picture
                    </div>
                    <div className="editing">
                        <label htmlFor = "photo" className = "inTwo">
                            <div className = "roundedPhoto">
                                {getInsert()}
                            </div>
                            <input
                                id = "photo"
                                type = "file"
                                name = "photo"
                                value = {changes.photo}
                                onChange={trackChange}
                            />
                        </label>
                    </div>
                    <button disabled = {changes.photo == ""} className = "button underPhoto" onClick= {() => confirm()}> Update </button>
                </div>
                
                <div className = "section continued">
                    <div className =  "sectionHead">
                        Password
                    </div>
                    <div className = "editing">
                        Old Password
                        <label htmlFor = "prev"> 
                            <input className = "input"
                                    id = "prev"
                                    type = "password"
                                    name = "prev"
                                    value = {changes.prev}
                                    onChange = {trackChange}
                                    placeholder = "previous password..."
                            />
                        </label>
                    </div>
                    <div className = "editing">
                        <label htmlFor = "password">
                            New password
                        <input
                            className = "input"
                            id = "pass"
                            type = "password" 
                            name = "password"
                            value = {changes.pass}
                            onChange = {trackChange}
                            placeholder = "new password..."/>
                        </label>

                        <button disabled = {changes.pass == "" && changes.prev == ""} className = "button" onClick= {() => confirm()}> Update </button>
                    </div>

                    {/* Self-decided username, Name change requests, preferred pronouns, phone number, profile picture changing */}
                    <div className = "success" id = "pass"></div>
                </div>
                <div className = "section continued">
                    <div className = "sectionHead">
                        Username
                    </div>
                    <div className="editing">
                        New Username
                        <label htmlFor = "username"> 
                            <input className = "input"
                                    id = "username"
                                    type = "text"
                                    name = "username"
                                    value = {changes.username}
                                    onChange = {trackChange}
                                    placeholder = "new display name..."
                            />
                        </label>

                        <button disabled = {changes.username == ""} className = "button" onClick= {() => confirm()}> Update </button>
                    </div>
                </div>

                <div className = "section continued">
                    <div className = "sectionHead">
                        Points Sheet Name
                    </div>
                    <div className="editing">
                        Request New Name
                        <label htmlFor = "sheetname"> 
                            <input className = "input"
                                    id = "sheetname"
                                    type = "text"
                                    name = "sheetname"
                                    value = {changes.sheetname}
                                    onChange = {trackChange}
                                    placeholder = "new on-sheet name..."
                            />
                        </label>

                        <button disabled = {changes.sheetname == ""} className = "button" onClick= {() => request()}> Request </button>
                    </div>
                </div>


                {/*<div className = "section">idk what i'm doing pls help. very quickly you seem to care for your account. 
                    That is a good thing. Now, another good thing is the importance of a stable mindset in programming. 
                    Now, that is not very well supported when spotify keeps recommending me fleet foxes. They are good. 
                    However. Did you also know that in the process of denoting a lot of very "indefinite" things, 
                    mathematicians tend to "cheat" and just put it in this big O(n) lookin thing. That's not just for 
                    programming. That's just anything that goes somewhere but doesn't exactly, like most of our lives. 
                    By the way, photons are probably better communicated as having the shape of "swinging hand percussion 
                    balls" rather than your average transverse wave. It's just constantly phasing between being a magnetic
                    perturbation and an electric one, each generating each other in Faraday's Induction and Ampere's Law
                    Thus, it's easier to describe it as one thing dipping between states rather than two states generating
                    each other periodically. A lot of things are waves. like everything is - and i guess all waves are also
                    just funny fields doing their own goofy things. There's also then the fact that now that you think of
                    everything as waves, everything must also be a continuous random distribution because schrodinger idk.
                    Guy was pretty funny. His first draft wave function was correct, but it was ugly, and so as all people do
                    he likey not so much. but now what u get is this absolute beauty of a dePsi/det = Ham(Psi). Even the time
                    dependent version is beautiful. except the second order partial differential. That's just uncool. "this
                    equation is simple in 96 dimensions". I would like to stay in 3 spatial dimensions thank you very much.</div> */
                }
                </div>
        </div>
        </>
    )

}

export default Settings