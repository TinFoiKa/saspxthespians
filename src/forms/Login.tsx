import "./Login.css"

const Login = () => {
    return (
        <>
            <div className="route" id="welcome"></div>
                <div id="app">
                <div className="app-view">  
                    <header className="app-header">
                    <h1>Lines</h1>
                    Welcome back,<br/>
                    <span className="app-subheading">
                        sign in to continue<br/>
                        to Lines.
                    </span>
                    </header>
                    <input type="email" required pattern=".*\.\w{2,}" placeholder="Email Address" />
                    <input type="password" required placeholder="Password" />
                    <a href="#welcome" className="app-button">Login</a>
                </div>
            </div>
        </>
    )
}

export default Login