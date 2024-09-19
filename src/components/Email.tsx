import { Html, Button } from "@react-email/components";
import { useEffect, useState } from "react";
import { databaseQuery } from "../handlers/notion-handler";
import { Resend } from "resend"

const ConfirmationEmail = (props: {info: {email: string, points: number, activity: string}}) => {
    const { info } = props

    const resend = new Resend('re_123456789')

    const [points, setPoints] = useState()

    const sendDevEmail = async () => {
        await resend.emails.send({
            from: info.email,
            to: 'aaronli69@outlook.com',
            subject: 'WHAT THE FUOHEAUHOQJPW',
            text: "WHAAAAAAAAAAAA"
        })
    }

    useEffect(() => {
        const getPoints = async () => {
            const usersDB = "b767e5f4b1b24a07b72684aae893453b"
            const query = new databaseQuery("{Email is_"+ info.email +"}", usersDB)
            const response = await (await query.execute()).json()

            setPoints(response.results[0].properties['Total Points'].number)
        }
        
        getPoints()
    }, [info])

    return (
        <Html lang="en">
            <div>
                <h1>Submission Recieved!</h1>
                <p>You currently have {points} Points</p>
                <p>You just recently submitted Activity: {info.activity} </p>
                <p>For {info.points} Points</p>
            </div>
        <Button onClick = {sendDevEmail}>Cool Button That Does Something</Button>
        </Html>
    );
}

export default ConfirmationEmail;