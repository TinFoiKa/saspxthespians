import { useState, useEffect, SetStateAction, ChangeEvent } from "react"
import "../../forms/Points.css"

const TimeSelection = (props: {setFormInfo: React.Dispatch<SetStateAction<{
    date: string,
    submissionDate: string
    sendEmail: string,
    activityType: string,
    activityName: string,
    qualified: number,
    actLength: string,
    details: string,
}>>, formInfo: {
    date: string
    submissionDate: string
    sendEmail: string,
    activityType: string,
    activityName: string,
    qualified: number,
    actLength: string,
    details: string,
}, data: {
    Name: {title: {plain_text: string}[]},
    'Full Length': {number : number}
    'One Act': {number : number}
    'Per Hour/Time': {number: number}
    Qualifier: {rich_text: {plain_text: string}[]}
}, setData: React.Dispatch<SetStateAction<{
    Name: {title: {plain_text: string}[]},
    'Full Length': {number : number}
    'One Act': {number : number}
    'Per Hour/Time': {number: number}
    Qualifier: {rich_text: {plain_text: string}[]}}>>
}) => {

    const data = props.data
    const name = props.formInfo.activityName
    const isPerQual = data.Qualifier.rich_text.length != 0
    const [populated, setPopulated] = useState(<></>)

    useEffect(() => {
        const updateParent = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            const {id, value} = event.target
            const call = props.setFormInfo((prevInfo) => ({
                ...prevInfo,
                [id]: value
            }))
    
            return call
        }
        
        const populateName = () => {
            if(name == "default" || name == ""){
                return (<></>)
            }

            console.log(data)

            // per time vs full length v One Act
            const ret = isPerQual ? (<div className="formbold-mb-3"> 
                <label htmlFor="qualified" className="formbold-form-label"> Amount of Time(s) Spent ({data.Qualifier.rich_text[0].plain_text}) </label>
                <input
                type="number"
                name="number"
                id="qualified"
                onChange = {updateParent}
                placeholder="ex: 3"
                className="formbold-form-input"
                required
                />
            </div>) : (<div className="formbold-mb-3">
                    <label className="formbold-form-label"> Length of Performance </label>

                    <select className="formbold-form-input" name="actLength" id="actLength" onChange = {updateParent} required>
                    <option value = "default">Choose one...</option>
                    <option value="Full Length">Full Length</option>
                    <option value="One Act">One Act</option>
                    </select>
                </div>) // full length or half length
            return ret
        }

        setPopulated(populateName())
    }, [data, props, name, isPerQual])

    return (<>
        {populated}
    </>)
}

export default TimeSelection