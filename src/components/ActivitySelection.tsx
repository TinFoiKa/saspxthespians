import { useState, useEffect } from "react"
import { databaseQuery } from "../handlers/notion-handler"
import "../forms/Points.css"

const ActivitySelection = (props: {type: string}) => {
    const type = props.type
    const [pointsSheet, setPointsSheet] = useState([])

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
        
    })

    return (<>
        {pointsSheet.map(() => {

        })}
    </>)
}

export default ActivitySelection