import { Suspense, lazy , } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'

import Home from "./pages/Home.tsx"
import Navbar from "./components/Navbar"
import Loading from "./components/Loading"
import Login from "./forms/Login.tsx"
const Control = lazy(() => import("./pages/Control.tsx"))
const Points = lazy(() => import("./forms/Points.tsx"))

const App = () => {

  return (
    <>
      <div className="container">
        <Routes>
            <Route path = "/login" element = {<></>} />
            <Route path = "*" element = {<Navbar/>}/>
        </Routes>
            
            <Suspense fallback = {<Loading />}>
                <Routes>
                    <Route path = "/" element = {<Home />} />
                    <Route path = "/points" element = {<Points />} />
                    <Route path = "/officers" element = {<Control />} />
                    <Route path = "/login" element = {<Login />} />
                </Routes>
            </Suspense>
        </div>
    </>
  )
}

export default App
