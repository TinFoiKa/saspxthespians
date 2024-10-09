import { Suspense, lazy , } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'

import Home from "./pages/Home.tsx"
import Navbar from "./components/Navbar"
import Loading from "./components/Loading"
import Login from "./forms/Login.tsx"
const Control = lazy(() => import("./pages/Control.tsx"))
const Points = lazy(() => import("./forms/Points.tsx").then(module => ({default: module.Points})))
const Success = lazy(() => import("./forms/Points.tsx").then(module => ({default: module.Success})))
const Upload = lazy(() => import("./forms/Upload.tsx"))
const Settings = lazy(() => import("./pages/Settings.tsx"))

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
                    <Route path = "/points/success" element = {<Success />} />
                    <Route path = "/officers" element = {<Control />} />
                    <Route path = "/login" element = {<Login />} />
                    <Route path = "/upload/writing" element = {<Upload />}/>
                    <Route path = "/settings" element = {<Settings />} />
                </Routes>
            </Suspense>
        </div>
    </>
  )
}

export default App
