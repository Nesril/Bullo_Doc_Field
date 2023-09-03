import React from 'react'
import "../../../style/dash.css"
import { Outlet } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'
export default function Dash({userData}) {
  return (
    <div className='Dashboard'>
       <div ><DashboardHeader userData={userData}/></div>
       <div  className='Dashboard-routes'><Outlet/></div>
    </div>
  )
}
