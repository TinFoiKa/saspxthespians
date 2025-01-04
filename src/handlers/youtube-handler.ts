class youtubeRequest {
    protected url = "https://sasthespians.aaronli69.workers.dev"
    protected redirectUri: string;

    constructor() {
        // Get the current URL for OAuth redirect
        this.redirectUri = window.location.origin + window.location.pathname;
    }
}

class auth extends youtubeRequest {
    private dir = "/youtube/auth"
    
    constructor() {
        super();
    }

    async getAuthUrl() {
        const response = await fetch(this.url + this.dir, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: 'getAuthUrl',
                redirectUri: this.redirectUri
            })
        });

        const data = await response.json();
        return data.authUrl;
    }

    async exchangeCode(code: string) {
        const response = await fetch(this.url + this.dir, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: 'exchangeCode',
                code,
                redirectUri: this.redirectUri
            })
        });

        const data = await response.json();
        if (data.accessToken) {
            sessionStorage.setItem('youtube_token', data.accessToken);
            return data.accessToken;
        }
        throw new Error('Failed to get access token');
    }
}

class upload extends youtubeRequest {
    private dir = "/youtube/upload"
    private formData: FormData;

    constructor(file: File, title: string, description: string) {
        super();
        this.formData = new FormData();
        this.formData.append('file', file);
        this.formData.append('title', title);
        this.formData.append('description', description);
        
        const token = sessionStorage.getItem('youtube_token');
        if (token) {
            this.formData.append('accessToken', token);
        }
    }

    async send() {
        const response = await fetch(this.url + this.dir, {
            method: "POST",
            body: this.formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        return response;
    }
}

export { upload, auth }