import React from "react"
import Navbar from "../../Components/Common/User/Navbar.common"
import { Outlet } from "react-router-dom"
import Footer from "../../Components/Common/User/Footer.common"

const Main = () => {
  return (
    <>
      <Navbar/>
      <Outlet />
      <Footer/>
    </>
  )
}

export default Main
