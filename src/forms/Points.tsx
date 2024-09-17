import "./Points.css"
import { ChangeEvent, useEffect, useState } from "react"
import { databaseQuery } from "../handlers/notion-handler"
import ActivitySelection from "../components/Points/ActivitySelection"
import TimeSelection from "../components/Points/TimeSelection"
import { useCookies } from "react-cookie"

const Points = () => {
    const [info, setInfo] = useState({
        name: "",
        membertype: "",
        gradelevel: "",
        email: "",
    })

    const [childData, setChildData] = useState({
        Name: {title: [{plain_text: ""}]},
        'Full Length': {},
        'One Act': {},
        'Per Hour/Time': {},
        Qualifier: {rich_text: [{plain_text: ""}]}
    })

    const [cookie] = useCookies(['auth'])

    const [formInput, setFormInput] = useState({
        date: "",
        submissionDate: "",
        sendEmail: false,
        activityType: "",
        activityName: ""
    })

    const getNameSplit = (index: number) => {
        if (info.name != "" || info.name != undefined) {
            return info.name.split(" ")[index]
        } else {
            return info.name
        } 
    }

    useEffect(() => {
        const initFetch = async () => {
            // break apart cookie
            const auth = cookie.auth 

            const userdata = "b767e5f4b1b24a07b72684aae893453b"
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
        <><div className="formbold-main-wrapper">
            {/* Author: FormBold Team -->
            <!-- Learn More: https://formbold.com --> */}
            <div className="formbold-form-wrapper">
                    <p className="title">Points Form</p>
                    
                <form action="https://formbold.com/s/FORM_ID" method="POST">

                <div className="formbold-input-wrapp formbold-mb-3">
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
                    <label htmlFor="doa" className="formbold-form-label"> Activity Date </label>
                    <input type="date" name="doa" id="doa" className="formbold-form-input" value = {formInput.date} onChange = {trackChange}/>
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
                    <label className="formbold-form-label"> Activity Type </label>

                    <select className="formbold-form-input" name="activityType" id="activityType" value = {formInput.activityType} onChange = {trackChange}>
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

                <div className="formbold-checkbox-wrapper">
                    <label htmlFor="sendEmail" className="formbold-checkbox-label">
                    <div className="formbold-relative">
                        <input
                        type="checkbox"
                        id="sendEmail"
                        className="formbold-input-checkbox"
                        
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

                <button className="formbold-btn">Submit</button>
                </form>
            </div>
            </div></>
    )
}

export default Points;

// have:
// Recursion, Search/sort, OOP (encapsulation), Data Manipulation, Validation, 2D array, API, working on HASH.