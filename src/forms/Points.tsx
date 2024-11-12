import "./Points.css"
import { ChangeEvent, useEffect, useState } from "react"
import { databaseQuery, databaseWrite, types } from "../handlers/notion-handler"
import ActivitySelection from "../components/Points/ActivitySelection"
import TimeSelection from "../components/Points/TimeSelection"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import ConfirmationEmail from '../components/Email';


const Points = () => {

    const navigate = useNavigate()

    const [info, setInfo] = useState({
        name: "",
        membertype: "",
        gradelevel: "",
        email: "",
    })

    const [finalPoints, setFinalPoints] = useState(Number)

    const [childData, setChildData] = useState({
        Name: {title: [{plain_text: ""}]},
        'Full Length': {number : 0},
        'One Act': {number: 0},
        'Per Hour/Time': {number: 0},
        Qualifier: {rich_text: [{plain_text: ""}]}
    })

    const [cookie] = useCookies(['auth'])

    const [formInput, setFormInput] = useState({
        date: "",
        submissionDate: "",
        sendEmail: "",
        activityType: "",
        activityName: "",
        qualified: 0,
        actLength: "",
        details: ""
    })

    const getNameSplit = (index: number) => {
        if (info.name != "" || info.name != undefined) {
            return info.name.split(" ")[index]
        } else {
            return info.name
        } 
    }

    const getPointsAmount = () => {
        const computationType : string = childData.Qualifier.rich_text.length == 0 ? formInput.actLength : "Per Hour/Time"

        console.log(computationType)

        let finalNum
        if(computationType == "Per Hour/Time") {
            finalNum = formInput.qualified * childData["Per Hour/Time"].number
            finalNum = finalNum.toFixed(1)
        } else {
            const comp = computationType == "Full Length" ? "Full Length" : "One Act" // just to block any errors coming into the ComputationType variable
            finalNum = childData[comp].number
        }

        setFinalPoints(+finalNum)

        return +finalNum
    }

    const submitAll = async () => {
        const database = "Points" // this is the database of the notion points

        // setting up today's time
        const clock = new Date()
        const raw = clock.getMonth()
        const month = raw.toString().length != 2 ? '0' + (raw + 1) : raw + 1
        const today = clock.getFullYear() + "-" + month + "-" + clock.getDate()

        // parsing activityName
        const blurb = JSON.parse(formInput.activityName)
        const activityName = blurb['Name'].title[0].text.content

        // this is the object array to be sent to the corresponding database
        const propObjects = [
            {Name: "Name", Property: types.title(info.name)},
            {Name: "Role", Property: types.select(info.membertype)},
            {Name: "Status", Property: types.select("Pending")},
            {Name: "Activity Date", Property: types.date(formInput.date)},
            {Name: "Submission Date", Property: types.date(today)},
            {Name: "Activity Type-Name", Property: types.text(activityName + "-" + formInput.activityType + "-" + (childData.Qualifier.rich_text.length > 0 ? formInput.qualified + childData.Qualifier.rich_text[0].plain_text : ""))},
            {Name: "Points Rewarded", Property: {"number": getPointsAmount()}},
            {Name: "Details", Property: types.text(formInput.details)}
        ] 
        
        console.log(propObjects)
       
        const query = new databaseWrite(propObjects, database)
        const response = await query.execute()

        console.log(formInput.sendEmail)
        // email
        if(formInput.sendEmail == "on") {
            await fetch("https://sasthespians.aaronli69.workers.dev/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({component: (<ConfirmationEmail info = {{email: info.email, points: finalPoints, activity: formInput.activityType}}/>)})
            })
        }

        if (response.status == 400) {
            const error = document.getElementById("error")
            if (error) error.innerText = "Error in points submission. May be a server error. Please contact officers if problem persists."
        } else {
            navigate("success")
        }
    
        console.log(response)
    }

    //* useEffect for initial query
    useEffect(() => {
        const initFetch = async () => {
            // break apart cookie
            const auth = cookie.auth 

            const userdata = "Users"
            const query = new databaseQuery("{Email is_"+ auth.email +"}", userdata)
            const response = await (await query.execute()).json()
            console.log(response)
            const properties = response.results[0].properties

            let member
            switch(auth.perms){
                case(1):
                    member = "Apprentice"
                    break;
                case(2):
                    member = "Member"
                    break;
                case(3):
                    member = "Officer"
                    break;
                default:
                    member = ""
            }

            const ret = {
                name: properties['Name'].title[0].plain_text, 
                membertype: member,
                gradelevel: properties['Grade'].select.name,
                email: properties['Email'].email
            }
            setInfo(ret)
        }

        initFetch()
    }, [cookie.auth])
    
    const trackChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {id, value} = event.target

        setFormInput((prevData) => ({
            ...prevData,
            [id] : value
        }))
    }


    return ( 
        <>
        <div className="formbold-main-wrapper">
            {/* Author: FormBold Team -->
            <!-- Learn More: https://formbold.com --> */}
            <div className="formbold-form-wrapper">
                <div className = "formbold-form-header">
                    <h3>Points Form</h3>
                    </div>
                <div className="formbold-input-wrap formbold-mb-3">
                    <label htmlFor="firstname" className="formbold-form-label"> Name </label>

                    <div>
                    <input
                        type="text"
                        name="firstname"
                        disabled
                        value = {getNameSplit(0)}
                        onChange = {trackChange}
                        id="firstname"
                        placeholder="First name"
                        className="formbold-form-input"
                        readOnly
                    />

                    <input
                        type="text"
                        name="lastname"
                        disabled
                        id="lastname"
                        value = {getNameSplit(1)}
                        onChange = {trackChange}
                        placeholder="Last name"
                        className="formbold-form-input"
                        readOnly
                    />
                    </div>
                </div>

                <div className="formbold-mb-3">
                    <label htmlFor="age" className="formbold-form-label"> Grade Level </label>
                    <input
                    type="text"
                    name="age"
                    id="age"
                    value = {info.gradelevel}
                    onChange = {trackChange}
                    placeholder="ex: Junior"
                    className="formbold-form-input"
                    readOnly
                    />
                </div>

                <div className="formbold-mb-3">
                    <label className="formbold-form-label"> Member Type </label>

                    <select className="formbold-form-input" name="occupation" id="occupation" value = {info.membertype} onChange = {trackChange} unselectable = "on">
                    <option value = "default">{info.membertype}</option>
                    <option value="Officer">Officer</option>
                    <option value="Member">Member</option>
                    <option value="Apprentice">Apprentice</option>
                    </select>
                </div>

                <div className="formbold-mb-3">
                    <label htmlFor="email" className="formbold-form-label"> Email </label>
                    <input
                    type="email"
                    name="email"
                    id="email"
                    value = {info.email}
                    onChange = {trackChange}
                    placeholder="example@email.com"
                    className="formbold-form-input"
                    />
                </div>

                <div className="formbold-mb-3">
                    <label htmlFor="doa" className="formbold-form-label"> Activity Date </label>
                    <input type="date" name="doa" id="date" className="formbold-form-input" value = {formInput.date} onChange = {trackChange}/>
                </div>

                <div className="formbold-mb-3">
                    <label htmlFor="details" className="formbold-form-label"> Name of Activity </label>
                    <input
                    type="text"
                    name="details"
                    id="details"
                    value = {formInput.details}
                    onChange = {trackChange}
                    placeholder="ex: The Tempest"
                    className="formbold-form-input"
                    required
                    />
                </div>

                <div className="formbold-mb-3">
                    <label className="formbold-form-label"> Activity Type </label>

                    <select className="formbold-form-input" name="activityType" id="activityType" value = {formInput.activityType} onChange = {trackChange} required>
                    <option value = "default">Choose one...</option>
                    <option value="Performance">Performance</option>
                    <option value="Production">Production</option>
                    <option value="Direction">Direction</option>
                    <option value="Writing">Writing</option>
                    <option value="Business">Business</option>
                    <option value="Misc">Miscellaneous</option>
                    </select>
                </div>
                
                <ActivitySelection type = {formInput.activityType} formInfo = {formInput} setChildData = {setChildData} setFormInfo = {setFormInput}/> {/* returns data of formInput.activityName */}

                <TimeSelection data = {childData} setData = {setChildData} formInfo = {formInput} setFormInfo = {setFormInput}/>

                <div className="formbold-checkbox-wrapper formbold-mb-3">
                    <label htmlFor="sendEmail" className="formbold-checkbox-label">
                    <div className="formbold-relative">
                        <input
                        type="checkbox"
                        id="sendEmail"
                        className="formbold-input-checkbox"
                        onChange={trackChange}
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
                    Would you like us to email you a confirmation message of this form?
                    </label>
                </div>

                <button id = "points" className = "formbold-btn" disabled = {formInput.date == "" || formInput.activityType == "" || formInput.activityName == "" || (formInput.actLength == "" && formInput.qualified == 0)} onClick = {submitAll}>Submit</button>
                </div>
                
                <div id = "error">

                </div>
            
            </div></>
    )
}

const Success = () => {
    const navigate = useNavigate()

    return ( 
        <div className="formbold-main-wrapper">
            <div className="formbold-form-wrapper">
                <p className="title">Submission Success!</p>
                <div className = "button-group">
                    <button className = "formbold-btn center green" onClick={() => {navigate("/points")}}>Submit Another </button>
                    <button className = "formbold-btn center" onClick={() => {navigate("/")}}>Home </button>
                </div>
            </div>
        </div>
    )
}

export {Points, Success};

// have:
// Recursion, Search/sort, OOP (encapsulation), Data Manipulation, Validation, 2D array, API, working on HASH.