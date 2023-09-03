import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./component/utils/main/index";
import Forget from "./component/log/forget";
import SignIn from "./component/log/signIn";
import SignUp from "./component/log/signUp";
import Home from "./component/utils/main/Home"
import Profile from "./component/utils/main/profile"
import Dashboardme from "./component/utils/dashboard/dash"
import NotFound from "./component/NotFound"
import Subscribe from "./component/utils/main/subscribe"
import DashIntro from "./component/utils/dashboard/DashIntro"
import Document_similaritry from "./component/utils/dashboard/doc_sim/Index"
import Document_summery from "./component/utils/dashboard/doc_sum/index"
import ShareFolder from "./component/utils/dashboard/doc_sim/shareFolder";
import Each_Folder from "./component/utils/dashboard/doc_sim/Each_Folder"
import axios from "axios";
 function App() {
    let [userData,setUserData]=useState(JSON.parse(localStorage.getItem("user"))||{
        logged:false,
        data:{},
    })
        useEffect(()=>{ 
          localStorage.setItem("user",JSON.stringify(userData))
    
      },[userData])
    
      useEffect(()=>{
    
        if(userData?.data?._id){
            axios.get(`${process.env.REACT_APP_URL}/api/users/${userData?.data?.d}`, //proxy uri
            {
               headers: {
                  authorization:`Bearer ${ userData?.token }`,
                  'Content-Type': 'application/json'
               } 
            })
            .then(res=>{
              setUserData(res.data)
              console.log(res.data);
            })
            .catch(error=>{
              console.log(error);
            })
        }
      },[])

      const [FolderEquilizer,GetFolderEquilizer]=useState(0)

  return (
  <BrowserRouter>
   <section className='main'>
       <link rel="apple-touch-icon" href="alif-dev's102023_200748.png" />
        <Routes>  
            <Route path='/' element={<Main userData={userData} setUserData={setUserData}/>}>
                 <Route path='' element={<Home userData={userData} setUserData={setUserData}/>}/>
                 <Route path='/subscribe' element={<Subscribe userData={userData} setUserData={setUserData}/>}/>

            </Route>
            {!userData?.token&&<Route path='/signin' element={<SignIn userData={userData} setUserData={setUserData}/>}/>}
            <Route path='/signup' element={<SignUp userData={userData} setUserData={setUserData}/>}/>
            <Route path='/forget' element={<Forget userData={userData} setUserData={setUserData}/>}/>
            {userData?.token&&
                <Route path='/dashboard' element={<Dashboardme userData={userData} setUserData={setUserData}/>}>
                    <Route path='' element={<DashIntro userData={userData} setUserData={setUserData}/>}/>
                    
                    <Route path='doc_similarity' element={<Document_similaritry GetFolderEquilizer={GetFolderEquilizer} FolderEquilizer={FolderEquilizer} userData={userData} setUserData={setUserData}/>}>
                           
                             <Route path='folder/:foldername' element={<Each_Folder GetFolderEquilizer={GetFolderEquilizer} FolderEquilizer={FolderEquilizer} userData={userData} setUserData={setUserData}/>}/>
                    
                             <Route path='sharefolder' element={<ShareFolder userData={userData} setUserData={setUserData}/>}/>
                    
                    </Route>
                    
                    <Route path='doc_summery' element={<Document_summery userData={userData} setUserData={setUserData}/>}/>
                    <Route path='profile' element={<Profile userData={userData} setUserData={setUserData}/>}/>
            
             </Route>}
            <Route path='*' element={<NotFound userData={userData} setUserData={setUserData}/>}/>

        </Routes>
    </section>
   
</BrowserRouter>
  );
}

export default App;
