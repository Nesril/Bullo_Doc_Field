import React from 'react'
import Header from "../../header_footer/header"
import { Outlet } from 'react-router-dom'
import "../../../style/main.css"
export default function Main({userData,setUserData}) {
  return (
    <div>
           <div><Header userData={userData} setUserData={setUserData}/></div>
            <div className='mainPage-bottom'><Outlet/></div>
    </div>
  )
}
