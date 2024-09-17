import { useState, useEffect, SetStateAction, ChangeEvent } from "react"
import { databaseQuery } from "../../handlers/notion-handler"
import "../../forms/Points.css"

const ActivitySelection = (props: {type: string, formInfo: {
    date: string
    submissionDate: string
    sendEmail: boolean,
    activityType: string,
    activityName: string
}, setFormInfo: React.Dispatch<SetStateAction<{
    date: string,
    submissionDate: string
    sendEmail: boolean,
    activityType: string,
    activityName: string
}>>, setChildData: React.Dispatch<SetStateAction<{
    Name: {title: {plain_text: string}[]},
    'Full Length': object
    'One Act': object
    'Per Hour/Time': object
    Qualifier: {rich_text: {plain_text: string}[]}}>>
}) => {

    const type = props.type
    const [pointsSheet, setPointsSheet] = useState([{properties: {
        Name: {title: [{plain_text: ""}]},
        'Full Length': {},
        'One Act': {},
        'Per Hour/Time': {},
        Qualifier: {rich_text: [{plain_text: ""}]}
    }}])

    const [populated, setPopulated] = useState(<></>)

    useEffect(() => {
        const getPointsSheet = async () => {
            const points = "4b878fc3319a44d2b0ed1fe6295e298d"
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
    }, [type])

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

                <select className="formbold-form-input" name="activityName" id="activityName" onChange = {updateParent}>
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