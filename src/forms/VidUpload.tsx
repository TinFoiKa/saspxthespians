import { ChangeEvent, useState } from "react";
import { upload } from "../handlers/youtube-handler";

const VidUpload = () => {
    const [file, setFile] = useState({
        url: "",
        title: "",
        description: "",
    })

    const updateUpload = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target
        setFile((prevState) => ({
            ...prevState,
            [id] : value
        }))
    }

    const pushToYoutube = async () => {
        const video = new upload(file.url, file.title, file.description)

        await video.send()
    }

    return (
        <div className = "vidWrapper">
            <div className = "vidContent">
                <div className = "vidHeading">
                    Upload a Video
                </div>
                <div className = "upload">
                    <label htmlFor = "title">
                        Title
                        <input 
                            id = "title"
                            type = "text"
                            name = "title"
                            value = {file.title}
                            placeholder="title"
                            onChange={updateUpload}
                        />
                    </label>
                    <label htmlFor = "url" className = "videoArea">
                        Video
                        <input 
                            id = "url"
                            type = "file"
                            name = "url"
                            value = {file.url}
                            accept = ".mp4; .mov"
                            onChange={updateUpload}
                        />
                    </label>
                    <label htmlFor = "description">
                        description
                        <textarea 
                            id = "description"
                            rows = {5}
                            name = "description"
                            value = {file.description}
                            onChange={updateUpload}
                        />
                    </label>

                    <button className="" onClick={pushToYoutube}>Upload</button>
                </div>
            </div>
        </div>
    )
}

export default VidUpload;