
 
class youtubeRequest {
    url = "https://sasthespians.aaronli69.workers.dev"

    constructor() {

    }
}

class upload extends youtubeRequest {
    dir = "youtube/youtube.upload"
    videoFilePath: string
    title: string
    description: string

    constructor(filePath: string, title: string, description: string) {
        super();
        this.videoFilePath = filePath
        this.title = title
        this.description = description
    }

    async send() {
        const body = {
            url: this.videoFilePath,
            title: this.title,
            description:this.description
        };
        const response = await fetch(this.url + this.dir, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(body)
        })

        return response
    }

}

export { upload }