import React, { useEffect, useState } from 'react'
import { Link as MuiLink } from '@mui/material';
import {motion } from 'framer-motion'
import * as Scroll from 'react-scroll';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Link, useLocation } from 'react-router-dom';
import { Select } from 'antd';
export default function DashboardHeader({userData}) {
    const location = useLocation()
    const [routes,setRoutes]=useState(location.pathname.split("/"))
  
     const RouteChanged=(route)=>{
        if(routes.length>=3&&routes[2]===route) return true
        else return false
     }
      
    const matches = useMediaQuery('(max-width:800px)');

    const [select,handleSelect]=useState()
    useEffect(()=>{
    
        let myRoutes= ["doc_similarity","doc_summery"]
    
       if(routes.length>=3&&myRoutes.includes(routes[2])) {
           console.log(("yes"));
          return handleSelect(routes[2])}
    
    },[routes])
  return (
    <div className='dashboard-header'>
        <div className='dashboard-header-logo' >
            <MuiLink href="/">
                    <div><img src={'/bullo-low-resolution-logo-black-on-transparent-background.png'} width={80} alt='logo.pic'/></div>
            </MuiLink>
         </div>
        <div className='dashboard-header-links'>
            <div><MuiLink href="/subscribe">Subscribe </MuiLink></div>
            {matches?
              <Select placeholder="Product"  style={{
                width: 120,
                }}  value={select}  onChange={(value)=>handleSelect(value)}>                         
                 <Select.Option><div><MuiLink style={{textDecoration:"none",color:"inherit"}} className={RouteChanged("doc_similarity")&&"dash-active-link"} href="/dashboard/doc_similarity">Doc Checker </MuiLink></div></Select.Option>
                 <Select.Option><div><MuiLink style={{textDecoration:"none",color:"inherit"}} className={RouteChanged("doc_summery")&&"dash-active-link"} href="/dashboard/doc_summery">Doc Summary </MuiLink></div></Select.Option>
              </Select>
              :
              <>
                    <div><MuiLink className={RouteChanged("doc_similarity")&&"dash-active-link"} href="/dashboard/doc_similarity">Doc Checker </MuiLink></div>
                    <div><MuiLink className={RouteChanged("doc_summery")&&"dash-active-link"} href="/dashboard/doc_summery">Doc Summary </MuiLink></div>
              </>
            }
        </div>

        <div className='dashboard-header-profile'>
            <div><MuiLink  className={RouteChanged("profile")&&"dash-active-profile"}  href="/dashboard/profile"><img width={40} src={userData?.data?.profilePicture||"/bulloLogo.png"} alt='me.pic'/></MuiLink></div>
        </div>

          
    </div>
  )
}
