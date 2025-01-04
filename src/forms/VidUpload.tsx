import { ChangeEvent, useState } from "react";
import { upload, auth } from "../handlers/youtube-handler";
import "../pages/Surfaces.css"

interface VideoState {
    url: string;
    title: string;
    description: string;
    file?: File;
}

interface ErrorState {
    message: string;
    type: 'error' | 'success' | '';
}

const VidUpload = () => {
    const [file, setFile] = useState<VideoState>({
        url: "",
        title: "",
        description: "",
    });
    const [authStatus, setAuthStatus] = useState<'initial' | 'authenticating' | 'authenticated'>('initial');
    const [error, setError] = useState<ErrorState>({ message: '', type: '' });

    const updateUpload = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        
        if (e.target.id === "url" && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
            const vid = document.getElementById("videoFile") as HTMLVideoElement;
            const fileObj = e.target.files[0];
            const objectUrl = URL.createObjectURL(fileObj);
            
            if(vid) {
                vid.src = objectUrl;
                vid.style.display = "block";
            }
            
            setFile(prevState => ({
                ...prevState,
                url: value,
                file: fileObj
            }));
            
            return () => URL.revokeObjectURL(objectUrl);
        }

        setFile(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const setErrorMessage = (message: string, type: ErrorState['type'] = 'error') => {
        setError({ message, type });
    };

    const pushToYoutube = async () => {
        try {
            setErrorMessage('', '');
            setAuthStatus('authenticating');
            
            if (authStatus !== 'authenticated') {
                const authHandler = new auth();
                const authUrl = await authHandler.getAuthUrl();
                window.location.href = authUrl;
                return;
            }

            if (!file.file) {
                throw new Error('No file selected');
            }

            const video = new upload(file.file, file.title, file.description);
            const res = await video.send();
            
            if (!res.ok) {
                throw new Error('Upload failed');
            }

            setErrorMessage("Upload successful!", 'success');
            setAuthStatus('authenticated');
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
            setAuthStatus('initial');
        }
    };

    const triggerFileInput = () => {
        document.getElementById("url")?.click();
    };

    return (
        <div className="editWrapper">
            <div className="editContent">
                <div className="mainHeader">
                    Upload Video
                </div>
                
                <div className="section continued">
                    <div className="sectionHead">
                        Title
                    </div>
                    <div className="editing">
                        <label htmlFor="title">
                            <input 
                                className="input"
                                id="title"
                                type="text"
                                name="title"
                                value={file.title}
                                placeholder="Show Name, Date, etc."
                                onChange={updateUpload}
                            />
                        </label>
                    </div>
                </div>

                <div className="section continued">
                    <div className="sectionHead">
                        Video File
                    </div>
                    <div className="editing">
                        <label htmlFor="url">
                            <div className="videoPreview" onClick={triggerFileInput}>
                                <video width="320" height="240" controls id="videoFile">
                                    <source src="" type="video/mp4"/>
                                </video>
                            </div>
                        
                            <input 
                                id="url"
                                type="file"
                                name="url"
                                value={file.url}
                                accept=".mp4, .mov"
                                onChange={updateUpload}
                                className="hiddenInput"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>

                <div className="section continued">
                    <div className="sectionHead">
                        Description
                    </div>
                    <div className="editing">
                        <label htmlFor="description">
                            <textarea 
                                className="input"
                                id="description"
                                rows={5}
                                name="description"
                                value={file.description}
                                onChange={updateUpload}
                            />
                        </label>
                    </div>

                    <button 
                        className="button" 
                        disabled={!file.url || !file.title || !file.description}
                        onClick={pushToYoutube}
                    >
                        {authStatus === 'authenticated' ? 'Upload' : 'Authenticate and Upload'}
                    </button>
                    
                    {error.message && (
                        <div className={`message ${error.type}`}>
                            {error.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VidUpload;