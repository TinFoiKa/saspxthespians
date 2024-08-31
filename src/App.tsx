import { Suspense, lazy } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'

import Home from "./pages/Home.tsx"
import Navbar from "./components/Navbar"
import Loading from "./components/Loading"
const Control = lazy(() => import("./pages/Control.tsx"))
const Points = lazy(() => import("./forms/Points.tsx"))

function App(props: {permissions: boolean}) {

  return (
    <>
      <div className="container">
            <Navbar permissions = {props.permissions} />
            <Suspense fallback = {<Loading />}>
                <Routes>
                    <Route path = "/" element = {<Home />} />
                    <Route path = "/points" element = {<Points />} />
                    <Route path = "/officers" element = {<Control />} />
                </Routes>
            </Suspense>
        </div>
    </>
  )
}

export default App
