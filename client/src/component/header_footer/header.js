import React,{useState,useEffect} from 'react'
import "../../style/header.css"
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Link as LN } from 'react-scroll';
import { Link as MuiLink } from '@mui/material';
import {motion } from 'framer-motion'
import * as Scroll from 'react-scroll';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
export default function Header({userData,setUserData}) {

  let [scrollEffect,setScrollEffect]=useState(false)
 let [scroly,setScroly]=useState(0)
useEffect(()=>{
 function handleScroll(){
   setScroly(window.scrollY)
  // console.log(scroly);
   if(scroly>200){
     setScrollEffect(true)
   }
   else{
     setScrollEffect(false)
   }
 } 
window.addEventListener("scroll",handleScroll)
},[scroly])

const matches = useMediaQuery('(max-width:800px)');
const [menuOpen,handleMenu]=useState(false)
let navigate=useNavigate()



const[okPage,openOkPage]=useState(false)
const loggingOut=()=>{
  openOkPage(true)
}

let [load,setLoad]=useState(false)
let [error,GetError]=useState("")

const confirmed=()=>{
  setLoad(true)
  console.log(userData.token);
  let val={}
  axios.post(`${process.env.REACT_APP_URL}/api/logout/`,val,
      {
    headers: {
      Authorization:`Token ${userData.token}`,
      'Content-Type': 'application/json'
      } 
     })
   .then(res=>{
      setLoad(false)
        localStorage.removeItem('user');
        setUserData({logged:false,data:{}})
        openOkPage(false)
        navigate("/")

   }).catch((error) => {
    setLoad(false)
    GetError(error?.response?.data.detail||"Error occured try again !!");

    setTimeout(()=>{
      GetError("")
    },3000)
 
});
}
console.log(userData);

  return (
  <>
    <div className={`main-header ${scrollEffect&&"main-header-scrolled"}`}>
         <MuiLink href="/"><div className='main-header-left' >
             <div><img src={!scrollEffect?'bullo-low-resolution-logo-color-on-transparent-background.png':'bullo-low-resolution-logo-black-on-transparent-background.png'} width={80} alt='logo.pic'/></div>
             <div className='main-header-left-name'>Bullo Doc Field</div>
        </div></MuiLink>
        <div className={`main-header-right ${matches&&'short-main-header'}`}>
           {matches?
           <div className='short-main-header-right'>
             <MenuIcon style={{fontSize:"35px"}} onClick={()=>handleMenu(!menuOpen)}/>
             
           </div>:
             <>
              {userData?.token&&<div ><Link    to={"/dashboard"}>Dashboard</Link></div>}
              {!userData?.token?<div><Link  to={"/signIn"}>Sign in</Link></div>:<div className='main-header-right-logout' onClick={loggingOut}>Log Out</div>}
              <div><LN activeClass="active" spy={true} smooth={true} offset={50} duration={500}   to={"services"}> Services</LN></div>
              <div ><LN activeClass="active" spy={true} smooth={true} offset={50} duration={500}   to={"about"}>About</LN></div>
              <div ><LN activeClass="active" spy={true} smooth={true} offset={50} duration={500}   to={"Contact"}>Contact us</LN></div>
             </>
           }
            
        </div>
    
    </div>
    <div className={`short-main-header-right-list-closed ${(matches&&menuOpen)&&'short-main-header-right-list-open'}`}>
        <div style={{margin:"10px"}}>
            <CloseOutlined onClick={()=>handleMenu(!menuOpen)} style={{fontSize:"30px"}} />
         </div>
         <div className='short-main-header-right-list'>
              {userData?.token&&<div ><Link    to={"/dashboard"}>Dashboard</Link></div>}
      
              {!userData?.token?<div><Link  to={"/signIn"}>Sign in</Link></div>:<div className='main-header-right-logout' onClick={loggingOut}>Log Out</div>}
              <div style={{cursor:"pointer"}} ><LN activeClass="active" spy={true} smooth={true} offset={50} duration={500}   to={"services"}> Services</LN></div>
              <div style={{cursor:"pointer"}}><LN activeClass="active" spy={true} smooth={true} offset={50} duration={500}   to={"about"}>About</LN></div>
              <div style={{cursor:"pointer"}}><LN activeClass="active" spy={true} smooth={true} offset={50} duration={500}   to={"Contact"}>Contact us</LN></div>
         </div>
    </div>
    {okPage&&<motion.div 
                initial={{opacity:0,scale:0}}
                whileInView={{opacity:1,scale:1}}
                transition={{duration:0.5}}
              className='main-header-okPage'>
           <div>Are You sure do you want to log out</div>
           {load?<div style={{marginTop:"30px"}}><CircularProgress/></div>:
           <div  className='main-header-okPage-button'>
              <div><button onClick={confirmed} className='main-header-okPage-button-yes'>yes</button></div>
              <div><button  onClick={()=>openOkPage(false)}  className='main-header-okPage-button-no'>No</button></div>
           </div>
           }
           {error&&<motion.div 
              style={{color:"black",textAlign:"center"}}
                initial={{opacity:0,scale:0}}
                whileInView={{opacity:1,scale:1}}
                transition={{duration:0.5}} >{error} </motion.div>}
      </motion.div>}
   </>
  )
}
