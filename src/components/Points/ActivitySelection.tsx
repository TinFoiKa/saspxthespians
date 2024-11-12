import { useState, useEffect, SetStateAction, ChangeEvent } from "react"
import { databaseQuery } from "../../handlers/notion-handler"
import "../../forms/Points.css"

const ActivitySelection = (props: {type: string, formInfo: {
    date: string
    submissionDate: string
    sendEmail: string,
    activityType: string,
    activityName: string,
    qualified: number,
    actLength: string,
    details: string,
}, setFormInfo: React.Dispatch<SetStateAction<{
    date: string
    submissionDate: string
    sendEmail: string,
    activityType: string,
    activityName: string,
    qualified: number,
    actLength: string,
    details: string,
}>>, setChildData: React.Dispatch<SetStateAction<{
    Name: {title: {plain_text: string}[]},
    'Full Length': {number : number}
    'One Act': {number : number}
    'Per Hour/Time': {number: number}
    Qualifier: {rich_text: {plain_text: string}[]}}>>
}) => {

    const type = props.type
    const [pointsSheet, setPointsSheet] = useState([{properties: {
        Name: {title: [{plain_text: ""}]},
        'Full Length': {number : 0},
        'One Act': {number : 0},
        'Per Hour/Time': {number: 0},
        Qualifier: {rich_text: [{plain_text: ""}]}
    }}])

    const [populated, setPopulated] = useState(<></>)

    useEffect(() => {
        const getPointsSheet = async () => {
            const points = "Reference"
            const query = new databaseQuery("{Category of_" + type + "}", points)
            const data = await ( await query.execute() ).json()

            console.log(data)

            const array = data.results

            setPointsSheet(array)
        }

        console.log(type)
        if(type != "") {
            getPointsSheet()
        }
    }, [type, props])

    useEffect(() => {
        const updateParent = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            const {id, value} = event.target
            const call = props.setFormInfo((prevInfo) => ({
                ...prevInfo,
                [id]: value
            }))
        updateChildData(event.target.value)
            
            return call
        }

        const updateChildData = (val: string) => {
            const update = props.setChildData(JSON.parse(val))

            return update
        }
        
        const populateActivity = () => {
            if(props.type == "default" || props.type == ""){
                return (<></>)
            }
            const ret = (
            <div className="formbold-mb-3">
                <label className="formbold-form-label"> Activity Name </label>

                <select className="formbold-form-input" name="activityName" id="activityName" onChange = {updateParent} required>
                    <option value = "default"> Choose One... </option>
                {pointsSheet.map((data) => {
                    
                    const properties = data.properties 
                    
                    // isolate case that Qualifier exists
                    /*if(properties['Qualifier'].rich_text.length != 0) {
                        
                    } else {

                    }*/

                    const name = properties.Name.title[0].plain_text

                    return (<option value= {JSON.stringify(properties)} key = {name}>{name}</option>)
                })}
                
                </select>
            </div>)
            return ret
        }

        setPopulated(populateActivity())
    }, [pointsSheet, props])

    return (<>
        {populated}
    </>)
}

export default ActivitySelection