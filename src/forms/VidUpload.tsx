import { ChangeEvent, useState } from "react";
import { upload } from "../handlers/youtube-handler";
import "../pages/Surfaces.css"

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
        if (e.target.id == "url") {
            const vid = document.getElementById("videoFile");
            const media = e.target.value
            if(vid) {
                vid.setAttribute("src", media)
                vid.style.display = "block";
            } 
        }
    }

    const pushToYoutube = async () => {
        const video = new upload(file.url, file.title, file.description)

        const res = await video.send()
        if (res.ok) {
            console.log("error")
        }
    }

    return (
        <div className = "editWrapper">
            <div className = "editContent">
                <div className = "sectionHead continued">
                    Upload a Video
                </div>
                <div className = "sectionHead">
                    <label htmlFor = "title">
                        Title 
                        <div>
                        <input 
                            className="negatived input "
                            id = "title"
                            type = "text"
                            name = "title"
                            value = {file.title}
                            placeholder="Show Name, Date, etc."
                            onChange={updateUpload}
                        />
                        </div>
                    </label>
                </div>
                <div className = "sectionHead">
                    <label htmlFor = "url" className = "videoArea">
                        Video 
                        <div>
                        <video width="320" height="240" controls id = "videoFile">
                            <source src="" type="video/mp4"/>
                        </video> <br/>
                        <input 
                            id = "url"
                            type = "file"
                            name = "url"
                            value = {file.url}
                            accept = ".mp4; .mov"
                            onChange={updateUpload}
                        />
                        </div>
                        
                    </label>
                </div>
                <div className = "sectionHead">
                    <label htmlFor = "description">
                        Description
                        <div>
                        <textarea 
                            className = "negatived input"
                            id = "description"
                            rows = {5}
                            name = "description"
                            value = {file.description}
                            onChange={updateUpload}
                        />
                        </div>
                    </label>

                    <button className="" onClick={pushToYoutube}>Upload</button>
                </div>
            </div>
        </div>
    )
}

export default VidUpload;