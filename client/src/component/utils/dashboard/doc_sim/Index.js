import { Button, CircularProgress, LinearProgress, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Link as MuiLink } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Alert, message } from 'antd';

export default function Index({userData,FolderEquilizer,GetFolderEquilizer}) {

  const [overview,handleOverview]=useState(false)
  let [folders,handleFolders]=useState([])
  let [loading,setLoading]=useState(false)
  let [error,GetError]=useState(false)


  useEffect(()=>{
    setLoading(true)
     axios.get(`${process.env.REACT_APP_URL}/api/folder_get/?owner=${userData?.data?.id}`, {
      headers: {
        Authorization: `Token ${userData.token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      GetError(false)
     setLoading(false)
     handleFolders(response.data);
   
   }).catch((error) => {
     setLoading(false)
     if (error.response) {
      GetError(error.response.data.msg||"Error occured, please try again")
     } else if (error.request) {
      GetError("Error occured, please try again")
     } else {
      GetError("Error occured, please try again")
     }
      
   });
  },[FolderEquilizer])

 const[createFolder,handleCreateFolder]=useState(false)
  const[new_folder_name,handle_new_folder_name]=useState("")
  const[new_folder_loading,handle_new_folder_loading]=useState(false)

  const [errorMessage,setErrorMessage]=message.useMessage();
  const [messageApi, contextHolder] = message.useMessage();
     //successfull message
     const success = () => {
      messageApi.open({
        type: 'success',
        content: 'Folder successfuly Created',
        duration: 2,
      });

    };
    
    //errror message
 const Error = (message) => {
     errorMessage.open({
       type: 'error',
       content: message,
       duration: 3,
     });
   
   };

 function folderCreated(){
  handle_new_folder_loading(true)
  // let stringfyValue=JSON.stringify(values)
  let  values={
      foldername:new_folder_name,
      owner:userData?.data?.id
    }
   axios.post(`${process.env.REACT_APP_URL}/api/folder_create/`,values,{
      headers: {
        Authorization: `Token ${userData.token}`,
        'Content-Type': 'application/json'
      }
     })
    .then(function (response) {
      handle_new_folder_loading(false)
      handleCreateFolder(false)
      success()
      GetFolderEquilizer(FolderEquilizer+1)
   }).catch((error) => {
    handle_new_folder_loading(false)
     if (error.response) {
       Error(error.response.data.msg||"Error occured please check your internate connection then try agaim")
     } else if (error.request) {
       Error("network error")
     } else {
       Error("network error")
     }
   });

 }

 //folders tou get shared
 let [shared_folders,handle_shared_folders]=useState([])
 let [shared_loading,handle_shared_loading]=useState(false)
 let [shared_error,Get_shared_error]=useState(false)


 useEffect(()=>{
  handle_shared_loading(true)
    axios.get(`${process.env.REACT_APP_URL}/api/folder_get_shared_folder/`, {
     headers: {
       Authorization: `Token ${userData.token}`,
       'Content-Type': 'application/json'
     }
   })
   .then(function (response) {
    Get_shared_error(false)
    handle_shared_loading(false)
    handle_shared_folders(response.data);
  
  }).catch((error) => {
   console.log(error);
   handle_shared_loading(false)
    if (error.response) {
      Get_shared_error(error.response.data.msg||"Error occured, please try again")
    } else if (error.request) {
      Get_shared_error("Error occured, please try again")
    } else {
      Get_shared_error("Error occured, please try again")
    }
     
  });
 },[FolderEquilizer])


 console.log(shared_folders)
  return (
    <div className='dashboard-doc_sim'>
       <h1>Document similariry</h1>
        {setErrorMessage}
        {contextHolder}
       <div>
          <div style={{textAlign:"center"}}><Button onClick={()=>handleOverview(!overview)}> Overview</Button></div>
         {overview&&
          <div className='dashboard-doc_sim-overview'>
                <div> Document similarity refers to the measurement of how closely two or more documents resemble each other in terms of their content, structure, or meaning. It is a valuable concept in document management and analysis, as it allows users to identify common patterns, themes, or duplications among documents. By assessing document similarity, users can gain insights into relationships between documents, detect potential plagiarism, organize information effectively, and make informed decisions based on document comparisons.</div>

                <div>Document similarity analysis has various use cases across different domains:</div>

                <ol>
                    <li>Research Paper Comparison: Researchers can compare multiple research papers to identify overlapping content, evaluate the novelty of their work, and conduct literature reviews efficiently.
                    </li>
                    
                    <li>Plagiarism Detection: Document similarity analysis can help identify instances of content plagiarism by comparing documents against a database of existing documents or previously published works.
                      </li>
                    
                    <li>Grant Proposal Evaluation: Grant organizations can use document similarity analysis to assess the uniqueness and originality of grant proposals, ensuring fair evaluation and avoiding redundant research projects.
                        </li>

                    <li>Curriculum Development: Educational institutions can compare curriculum documents to identify areas of overlap or gaps, ensuring a comprehensive and well-rounded educational program.
                        </li>
                    
                    <li>Intellectual Property Research: Legal professionals and intellectual property experts can analyze document similarity to investigate potential patent infringements or trademark violations.
                        </li>

                    <li> Literature Review Automation: Document similarity analysis can automate the process of gathering and analyzing relevant literature for research projects, saving time and effort for researchers.
                        </li>

                    <li> Data Set Comparison: In data analysis and data science, document similarity analysis can be used to compare and identify similarities or differences between datasets, aiding in data integration and data quality assessment.
                        </li>
                  
                    <li>Content Recommendation Systems: Document similarity can be leveraged in content recommendation systems to suggest related articles, products, or services based on the similarity of documents.
                        </li>
                </ol>
                <div>Bullo Doc Field provides an efficient solution for document similarity analysis. Users start by creating a folder and adding the relevant documents they want to compare. When they want to check the similarity, they upload the files they wish to analyze and specify the folder they want to compare against. The software then performs a comprehensive comparison of the uploaded files with all the documents in the selected folder.
                    </div>
                <div>Using advanced algorithms and techniques, Bullo Doc Field calculates the similarity scores between documents and generates a list of files that are most similar to the uploaded documents. This allows users to quickly identify relevant documents, detect duplicates or overlapping content, and gain insights from the comparison results.
                      </div>
                <div>By leveraging Bullo Doc Field's document similarity analysis capabilities, users can streamline their document organization, conduct in-depth research, prevent plagiarism, and make informed decisions based on accurate and insightful document comparisons.
                        </div>

          </div>}
          <div className='dashboard-doc_sim-folders'>
              {createFolder?
                   <div className='dashboard-doc_sim-folders-create'>
                       <div><TextField value={new_folder_name} color="success"onChange={(e)=>handle_new_folder_name(e.target.value)} id="standard-basic" label="folder" variant="standard" /></div>
                       <div>{new_folder_loading?<CircularProgress size={20}/>:<button onClick={folderCreated}>Add</button>}</div>
                    </div>
                    :
                   <div><Button onClick={()=>handleCreateFolder(!createFolder)}>{<AddIcon/>} Create</Button></div>
                }
              {loading&&<div style={{width:"100%",marginBottom:"10px"}}>{<LinearProgress/>}</div>}
             
             <div style={{display:'flex',justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"20px"}}>
                  <div className='dashboard-doc_sim-folders-all'>
                      {folders?.map(e=>{
                        return <EachFolder userData={userData} key={e.id} data={e}/>
                      })}

                  </div>

                  <div  className='dashboard-doc_sim-folders-get-shared'>
                            {shared_folders?.map(e=>{
                              return <EachFolder userData={userData} key={e.id} data={e}/>
                            })}
                  </div>

             </div>
              {error&&<div style={{width:"50%",borderRadius:"50px"}}><Alert   closable type="error" message={error} banner /></div>}
          </div>
          <Outlet/>
       </div>
    </div>
  )
}

const EachFolder=({data,userData})=>{
  const location = useLocation()
  const [routes,setRoutes]=useState(location.pathname.split("/"))

   const RouteChanged=(route)=>{
      if(routes.length===5&&routes[routes.length-1]===route) return true
      else return false
   }
    
  return(
    <div className={`dashboard-doc_sim-eachFolder ${data?.owner!==userData?.data?.id&&"dashboard-doc_sim-sharedFolder"}`} >
        <MuiLink className={RouteChanged(data?.id)&&"dash-doc-sim-active-folder"} href={`/dashboard/doc_similarity/folder/${data?.id}`}> <Button>{data?.foldername}</Button> </MuiLink>
    </div>
  )
}
