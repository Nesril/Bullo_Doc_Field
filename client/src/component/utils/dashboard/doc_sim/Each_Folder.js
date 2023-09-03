import { Button, CircularProgress, TextField } from '@mui/material'
import { Input } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from "moment"
import { Alert,notification , message } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion'
import ShareIcon from '@mui/icons-material/Share';
import ReplyIcon from '@mui/icons-material/Reply';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Each_Folder({userData,FolderEquilizer,GetFolderEquilizer}) {
  const location = useLocation()
  const [routes,setRoutes]=useState(location.pathname.split("/"))
  let route=routes[routes.length-1]

  const [folderData,getFolderData]=useState({})
 ///get folder
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_URL}/api/folder_get/${route}?owner=${userData?.data?.id}`, {
      headers: {
        Authorization: `Token ${userData.token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
     getFolderData(response.data);
     console.log(response.data);
   
   }).catch((error) => {
      console.log(error);  
   });
  },[route])


 //get file
  let [files,handleFiles]=useState([])
  let [loading,setLoading]=useState(false)
  let [error,GetError]=useState(false)
 let [file_equilizer,handle_file_equilizer]=useState(0)


  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_URL}/api/file_folder/?folderID=${route}`, {
     headers: {
       Authorization: `Token ${userData.token}`,
       'Content-Type': 'application/json'
     }
   })
   .then(function (response) {
     GetError(false)
    setLoading(false)
    handleFiles(response.data);
    console.log(response.data);
  
  }).catch((error) => {
    console.log(error);
    setLoading(false)
    if (error.response) {
     GetError(error.response.data.error||error.response.data.details||"Error occured, please try again")
    } else if (error.request) {
     GetError("Error occured, please try again")
    } else {
     GetError("Error occured, please try again")
    }
     
  });
  },[routes,file_equilizer])
  
  let[SearchValue,GetSearchValue]=useState("")

  let filteredFiles=files?.filter(e=>{
      let filename=e.file.split("/")[3]?.toLowerCase()
    return filename.includes(SearchValue.toLowerCase())
  })


  const[DeletePage,GetDeletePage]=useState(false)
  const[delete_load,handle_delete_load]=useState(false)
  const[error_load,handle_error_load]=useState(false)
  const[folder_delete_values,handle_folder_delete_values]=useState("")
  
  let navigate=useNavigate()
  function delete_confirmed(){
        if(folder_delete_values.length<1) return handle_error_load("folder name")
        let value={
          foldername:folder_delete_values,
          id:route,
        }
        handle_delete_load(true)
        axios.delete(`${process.env.REACT_APP_URL}/api/folder_remove/`, {
          data: value,
          headers: {
            Authorization: `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          handle_error_load(false)
          handle_delete_load(false)
          GetFolderEquilizer(FolderEquilizer+2)
          GetDeletePage(false)
          handle_folder_delete_values("")
          navigate("/dashboard/doc_similarity")
       }).catch((error) => {
        handle_delete_load(false)
         if (error.response) {
          handle_error_load(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")
         } else if (error.request) {
          handle_error_load("Error occured, please try again")
         } else {
          handle_error_load("Error occured, please try again")
         }
      })

  }


  const [shared_user_page,show_shared_user_page]=useState(false)
  const [shared_user_error,show_shared_user_error]=useState(false)
  const [shared_user_load,show_shared_user_load]=useState(false)
  const[shared_users,get_shared_users]=useState([])
  const [shared_user_equilizer,handle_shared_user_equilizer]=useState(0)

  useEffect(()=>{
    show_shared_user_load(true)
    axios.get(`${process.env.REACT_APP_URL}/api/folder_get_shared_users?folderID=${route}`, {
      headers: {
        Authorization: `Token ${userData.token}`,
        'Content-Type': 'application/json'
      }
     })
    .then(function (response) {
       get_shared_users(response.data)
       show_shared_user_load(false)
    }).catch((error) => {
    show_shared_user_load(false)
     if (error.response) {
      show_shared_user_error(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")
     } else if (error.request) {
      show_shared_user_error("Error occured, please try again")
     } else {
      show_shared_user_error("Error occured, please try again")
     }
  })
  },[shared_user_equilizer])


  //add user_shared

  const[new_shared_user_page,add_new_shared_user_page]=useState(false)
  const[new_shared_user_error,add_new_shared_user_error]=useState(false)
  const[new_shared_user_load,add_new_shared_user_load]=useState(false)
  const[to_share_with,add_to_share_with]=useState("")

  function handle_add_Shared_User(){
    add_new_shared_user_load(true)
    let value={
      folderID:route,
      to_share_with:to_share_with
    }
    axios.put(`${process.env.REACT_APP_URL}/api/folder_add_shared_users/`,value, {
      headers: {
        Authorization: `Token ${userData.token}`,
        'Content-Type': 'application/json'
      }
     })
    .then(function (response) {
      handle_shared_user_equilizer(shared_user_equilizer+2)
      add_new_shared_user_load(false)
      add_new_shared_user_error(false)
      add_new_shared_user_page(false)
      add_to_share_with("")
    }).catch((error) => {
      add_new_shared_user_load(false)
     if (error.response) {
      add_new_shared_user_error(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")
     } else if (error.request) {
      add_new_shared_user_error("Error occured, please try again")
     } else {
      add_new_shared_user_error("Error occured, please try again")
     }
  })
   }

   const [agree_delete,handle_agree_delete]=useState(false)
   const [caution,openCoution]=useState(false)
   const [load_while_deleting_file,handle_load_while_deleting_file]=useState(false)


   const [errorMessage,setErrorMessage]=message.useMessage();
   const [messageApi, contextHolder] = message.useMessage();

   function file_deletion_confirmed(){
    openCoution(false)
    handle_agree_delete(true)
   }
      //successfull message
      const success = (text) => {
       messageApi.open({
         type: 'success',
         content: `${text}`,
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


   function DeleteIndividualFile(id){
    openCoution(true)
      if(agree_delete){
        let value={
          id:id
        }
        handle_load_while_deleting_file(true)
        axios.delete(`${process.env.REACT_APP_URL}/api/file_delete/`,{
          data: value,
          headers: {
            Authorization: `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          handle_file_equilizer(file_equilizer+1)
          handle_load_while_deleting_file(false)
          success("file sucessfully deleted")
          openCoution(false)
          handle_agree_delete(false)
        }).catch((error) => {
          handle_load_while_deleting_file(false)
         if (error.response) {
          Error(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")
         } else if (error.request) {
          Error("Error occured, please try again")
         } else {
          Error("Error occured, please try again")
         }
      })
        
      }
   //   else openCoution(true)
   }


   ///Add file


  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileSize, setFileSize] = useState([]);
  const [fileType, setFileType] = useState([]);
  
  const allowedFileTypes = ['text/plain','application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const [filenames,GetFilenames]=useState([])
 
  const handleFileChange = (event) => {
    const files = event.target.files;
    const selectedFilesArray = Array.from(files);
  let ex=selectedFilesArray
    GetFilenames(
      ex.map((file) => {
        if (allowedFileTypes?.includes(file.type)) {
          return file.name;
        }
        return null;
      })
    );

     setSelectedFiles(selectedFilesArray);
     setFileSize(selectedFilesArray.map((file) => file.size));
      setFileType(selectedFilesArray.map((file) => file.type));
  };


   const[load_onAdding,handle_load_onAdding]=useState(false)
  const handleSubmit = (event) => {
    event.preventDefault();
    handle_load_onAdding(true)
    const formData = new FormData();
    formData.append('folder', route);
    formData.append('owner', userData?.data?.id);
    
    selectedFiles.forEach((file, index) => {
      if (allowedFileTypes?.includes(file.type)&&file.type!==null) {
        const updatedFileName = `${file.name.split('.')[0]}_${userData?.data?.email}.${file.name.split('.')[1]}`;
        formData.append('file[]', file,updatedFileName);
        formData.append(`size_${index}`, fileSize[index]);
        formData.append(`file_type_${index}`, fileType[index]);
      }
    });


    axios.post(`${process.env.REACT_APP_URL}/api/file_add/`, formData, {
      headers: {
        Authorization: `Token ${userData?.token}`, // Include the access token if required
        'Content-Type': 'multipart/form-data', // Set the content type for the form data
      },
    })
      .then((response) => {
        // Handle the response from the server
        handle_load_onAdding(false)
        success("file sucessfully Added")
        handle_file_equilizer(file_equilizer+1)
        GetFilenames([])
        console.log(response.data);
      })
      .catch((error) => {
        handle_load_onAdding(false)
        console.error(error);
        Error(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")
      });
  };


  let [load_model,handle_load_model]=useState(false)
  const [sure_to_update,handle_sure_to_update]=useState(false)


  const openNotification = () => {
    api.open({
      message: 'Message',
      description:
        'Your model is successfuly updated you can use it starting from now.',
      duration: 0,
    });
  };
  const [api, contextHolder_new] = notification.useNotification();
  const Go_on_updating=()=>{
          handle_load_model(true)
      let value={
        folderID:route,
  
      }
  
      axios.post(`${process.env.REACT_APP_URL}/api/Create_model/`,value, {
        headers: {
          Authorization: `Token ${userData?.token}`, // Include the access token if required
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          handle_load_model(false)
          success("Model updated sucessfully")
          openNotification()
          console.log(response.data);
        })
        .catch((error) => {
          handle_load_model(false)
          Error(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")
          console.error(error);
        });
  }
  return (
  <div className='dashboard-folders-each'>
      <div className='dashboard-folders-each-folders'>
         
          <h1 >All Files {files.length} {folderData?.owner===userData?.data?.id&&
               <>{load_model?
                   <CircularProgress size={20}/>:
                    <Button disabled={sure_to_update} onClick={()=>handle_sure_to_update(true)}> Update Model</Button>}
                </>}
          </h1>
          {(sure_to_update&&folderData?.owner===userData?.data?.id)&&
          <motion.div 
            initial={{opacity:0,scale:0}}
            whileInView={{opacity:1,scale:1}}
            transition={{duration:0.5}} className='dashboard-folders-each-folders-deleteFile'>
           <p> 
                updating will make you to have updated model wich means. you can also check with newly added models.
           </p>
            <p>
                Its recommanded to update your model if you add new files to your folder or 
                the model is not correctly working mean if you are not getting correct out out
            </p>
            <div className='dashboard-folders-each-folders-deleteFile-buttons'>
                <div><Button onClick={Go_on_updating} style={{background:"#04425a",color:"white"}}>Go on</Button></div>
                <div><Button onClick={()=>handle_sure_to_update(false)} style={{background:"#a7520d",color:"white"}}>Cancel</Button></div>
            </div>
        </motion.div>
          }
          
        {setErrorMessage}
        {contextHolder}
        {contextHolder_new}


        {caution&&
          <motion.div 
              initial={{opacity:0,scale:0}}
              whileInView={{opacity:1,scale:1}}
              transition={{duration:0.5}} className='dashboard-folders-each-folders-deleteFile'>
             <div>  If you delete this file, please be aware that it cannot be recovered. Take this into consideration before proceeding with the deletion.</div>
             <div>if you still want to delete the file. hit the 'yes' button then go to the file and press the
               delete icon
             </div>
              <div className='dashboard-folders-each-folders-deleteFile-buttons'>
                  <div><Button onClick={file_deletion_confirmed} style={{background:"#04425a",color:"white"}}>Yes</Button></div>
                  <div><Button onClick={()=>openCoution(false)} style={{background:"#a7520d",color:"white"}}>No</Button></div>
              </div>
          </motion.div>
        }


          {DeletePage&&
          <motion.div 
                   initial={{opacity:0,scale:0}}
                    whileInView={{opacity:1,scale:1}}
                    transition={{duration:0.5}}
                    className='dashboard-folders-each-folders-delete'>
                      
              <div style={{marginBottom:"20px",fontSize:"20px"}}>Enter the folder name </div>
              
              <div className='dashboard-folders-each-folders-delete-Input'>
                    <Input status={error_load&&"error"}
                       onChange={(e)=>handle_folder_delete_values(e.target.value)}
                       value={folder_delete_values} />
              </div>
              {delete_load?<div style={{marginTop:"30px"}}><CircularProgress/></div>:
              <div className='dashboard-folders-each-folders-delete-button'>
                 <div className='dashboard-folders-each-folders-delete-button-drop'><Button onClick={delete_confirmed}>Drop</Button></div>
                 <div className='dashboard-folders-each-folders-delete-button-cancel'><Button onClick={()=>GetDeletePage(false)}>Cancel</Button></div>
              </div>}
              
              {error_load&&<motion.div 
                  style={{color:"black",textAlign:"center"}}
                    initial={{opacity:0,scale:0}}
                    whileInView={{opacity:1,scale:1}}
                    transition={{duration:0.5}} style={{marginTop:"10px"}} > <Alert type="error" message={error_load} banner /> </motion.div>}
          
          </motion.div>
          
          }

         
         {folderData?.owner===userData?.data?.id&& <div style={{textAlign:"end"}}><Button onClick={()=>GetDeletePage(!DeletePage)} style={{color:"white",background:"rgb(71, 18, 18)"}}>Delete Folder</Button></div>}
         {folderData?.owner===userData?.data?.id&& <div style={{textAlign:"end",margin:"10px 0 10px 0"}}><Button onClick={()=>show_shared_user_page(!shared_user_page)} style={{color:"white",background:"rgb(71, 18, 18)",fontSize:"12px"}}><ShareIcon style={{fontSize:"12px"}}/></Button></div>}
      
        
       {shared_user_page&&
       <motion.div 
          initial={{opacity:0,scale:0}}
            whileInView={{opacity:1,scale:1}}
            transition={{duration:0.5}} style={{display:"flex",justifyContent:"flex-end"}}>
          
          <div className='dashboard-folders-each-folders-share'>
               <div>list users that you share this Folder</div>
               {new_shared_user_page?
                 <div style={{margin:"15px 0 20px 0",display:"flex",justifyContent:"center",alignContent:"center"}}> 
                    <div><Input onChange={(e)=>add_to_share_with(e.target.value)} placeholder='user email'/></div>
                     {new_shared_user_load?<CircularProgress/>:<Button onClick={handle_add_Shared_User}>Add</Button>}
                  </div>
                  :
                 <div><Button onClick={()=>add_new_shared_user_page(!new_shared_user_page)}>Add user</Button></div>
                }
                <div style={{marginBottom:"10px",color:"red"}}>{new_shared_user_error}</div>
                {shared_users.map(e=>{
                  return <EachSharedUser route={route} userData={userData} shared_user_equilizer={shared_user_equilizer}  handle_shared_user_equilizer={handle_shared_user_equilizer} key={e.email} data={e}/>
                 })}
          
             </div>       
           </motion.div> }
          

          {loading&&<div style={{textAlign:"center"}}><CircularProgress/></div>}
          {error&&<div style={{color:"red"}}><Alert   closable type="error" message={error} banner /></div>}
          {files?.length===0?
            <div className='dashboard-folders-each-folders-NoFiles'>
                 No Files Added yet
                {folderData?.owner===userData?.data?.id&&
                  <div className='dashboard-folders-each-folders-addNewFile'>
                    <form onSubmit={handleSubmit}>
                              <label>
                                  <input multiple  type="file" onChange={handleFileChange} />
                                  <AddIcon className='dashboard-folders-each-folders-addNewFile-icon'/>
                              </label>
                              <div style={{display:filenames.length===0&&"none"}}><Button type="submit">Add</Button></div>
                              <div>{load_onAdding&&<CircularProgress size={20}/>}</div>

                      </form>
                      <div style={{display:"flex",width:"40%",justifyContent:"flex-start",flexDirection:"column",gap:"10px",fontSize:"12px"}}>
                           {filenames?.map((e,index)=>{
                            return <div key={index}>{e},</div>
                           })}
                      </div>

                  </div>}
            </div>
          
            :
            <div className='dashboard-folders-each-folders-allFiles'>
                <div className='dashboard-folders-each-folders-input'>
                   <div><input onChange={(e)=>GetSearchValue(e.target.value)} placeholder='search...'/></div> 
                   {folderData?.owner===userData?.data?.id&& <div className='dashboard-folders-each-folders-addNewFile'>
                    <form onSubmit={handleSubmit}>
                              <label>
                                  <input multiple  type="file" onChange={handleFileChange} />
                                  <AddIcon className='dashboard-folders-each-folders-addNewFile-icon'/>
                              </label>
                              <div style={{display:filenames.length===0&&"none"}}><Button type="submit">Add</Button></div>
                              <div>{load_onAdding&&<CircularProgress size={20}/>}</div>
                      </form>
                 </div>}
                   {folderData?.owner!==userData?.data?.id&&
                   <div className='dashboard-folders-each-folders-sharedBy'>
                     shared by {folderData?.owner_email}
                    </div>}
                 </div>
                 {folderData?.owner===userData?.data?.id&& 
                 <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",gap:"5px",marginBottom:"20px",fontSize:"15px"}}>
                           {filenames?.map((e,index)=>{
                            return <div style={{color:"black"}} key={index}>{e},</div>
                           })}
                  </div>}
                 <div class="dashboard-files-styled-table">
                    <table >
                          <thead>
                            <tr>
                              <th>no</th>
                              <th >Filename</th>
                              <th>Type</th>
                              <th>Size</th>
                              <th>Uploaded At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredFiles?.map((e,index) => (
                              <tr key={e.id}>
                                <td style={{width:"10%"}}>{index+1} {load_while_deleting_file?<CircularProgress/>:
                                      <>{
                                      folderData?.owner===userData?.data?.id&&<DeleteIcon onClick={()=>DeleteIndividualFile(e.id)}  style={{cursor:"pointer",fontSize:"13px",color:"red"}}/>
                                        }
                                        </>}
                                </td>
                                <td style={{width:"40%"}}>{(e.file.split("/")[3]).length>40?`${(e.file.split("/")[3]).slice(0,40)}...`:(e.file.split("/")[3])}</td>
                                <td style={{width:"20%"}}> {e.file_type}</td>
                                <td style={{width:"10%"}}>{(e.size / 1000000).toFixed(2)} MB</td>
                                <td style={{width:"10%"}}>{moment(e.uploaded_at).format('ll')}</td>
                              </tr>
                            ))}
                          </tbody>
                    </table>
                  </div>
            </div>
          }
      </div>
      <SimilarityChecker userData={userData} route={route}/>
  </div>
  )
}


const SimilarityChecker = ({userData,route}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filenames, setFilenames] = useState([]);
  const [checked_files,handle_checked_files]=useState([])

  const [errorMessage,setErrorMessage]=message.useMessage();
  const [messageApi, contextHolder] = message.useMessage();

        //successfull message
  const success = (text) => {
          messageApi.open({
            type: 'success',
            content: text,
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


  const allowedFileTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileChange = (event) => {
    const files = event.target.files;
    const selectedFilesArray = Array.from(files);
   
    setFilenames(
      selectedFilesArray.map((file) => {
        if (allowedFileTypes.includes(file.type)) {
          return file.name;
        }
        return null;
      })
    );

    setSelectedFiles(selectedFilesArray);
  };

  const [loading,handleLoading]=useState(false)
 
  const handleUpload = () => {
    handleLoading(true)
    const formData = new FormData();
    formData.append("folderID",route)
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    axios.post(`${process.env.REACT_APP_URL}/api/process_files/`, formData,{
      headers: {
        Authorization: `Token ${userData?.token}`, // Include the access token if required
        'Content-Type': 'multipart/form-data', // Set the content type for the form data
      },
    })
      .then((response) => {
        // Handle the response from the backend
        console.log(response.data);
        handleLoading(false)
        success("Similarity checked")
        handle_checked_files(response.data.data)
      })
      .catch((error) => {
        // Handle errors
        handleLoading(false)
        Error(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")

        console.error(error);
      });
  };


const CancelRequest=()=>{
  setSelectedFiles([])
  handle_checked_files([])
  setFilenames([])
}
  return (
    <div className="dashboard-folders-each-check">
      {contextHolder}
      {setErrorMessage}
      {selectedFiles?.length>0&&  
        <>{loading?<div style={{textAlign:"center"}}><CircularProgress /></div>:

          <motion.div 
          initial={{opacity:0,scale:0}}
          whileInView={{opacity:1,scale:1}}
          transition={{duration:0.5}} className="dashboard-folders-each-check-field-button"style={{textAlign:"center",margin:"30px 0 30px 0"}}>
             <Button onClick={handleUpload}>Upload and Process</Button>
           </motion.div>
          }
         </>
      }
      <div className="dashboard-folders-each-check-field">
        {filenames.length === 0 ? (
          <label>
            <input multiple type="file" onChange={handleFileChange} />
            <div>
              <AddIcon className="dashboard-folders-each-folders-addNewFile-icon" />
            </div>
            <div>Upload files you want to check here</div>
          </label>
        ) : (
          <>
            {filenames.map((e) => {
              return <div style={{fontSize:"12px"}} key={e}>{e}</div>;
            })}
          </>
        )}
      </div>
  
      {checked_files?.length>0&&<Button onClick={CancelRequest} style={{marginBottom:"20px",background:"#800606",color:"white"}}>Cancel</Button>}

      {checked_files?.length>0&&<div class="dashboard-files-styled-table">
                    <table >
                          <thead>
                            <tr>
                              <th>no</th>
                              <th >Data Filename</th>
                              <th>Similarity</th>
                              <th>Text Filename</th>
                            </tr>
                          </thead>
                          <tbody>
                            {checked_files?.map((e,index) => {
                              return(

                                <tr key={e.id}>
                                  <motion.td 
                                      initial={{opacity:0,scale:0}}
                                      whileInView={{opacity:1,scale:1}}>{index+1} 
                                  </motion.td>
                                  <motion.td 
                                      initial={{opacity:0,scale:0}}
                                      whileInView={{opacity:1,scale:1}}>{e["Data Filename"]?.length>40?`${e["Data Filename"]?.slice(0,40)}...`:e["Data Filename"]}</motion.td>
                                  <motion.td 
                                      initial={{opacity:0,scale:0}}
                                      whileInView={{opacity:1,scale:1}}>{(e.similarity*100).toFixed(2)} %</motion.td>
                                  <motion.td 
                                      initial={{opacity:0,scale:0}}
                                      whileInView={{opacity:1,scale:1}}>{e["Text Filename"]?.length>40?`${e["Text Filename"].slice(0,40)}...`:e["Text Filename"]}</motion.td>
                                </tr>
                              )})}
                          </tbody>
                    </table>
        </div>}
    </div>
  );
};






const EachSharedUser=({userData,route,data,handle_shared_user_equilizer,shared_user_equilizer})=>{
  const[remove_shared_user_load,get_remove_shared_user_load]=useState(false)
  const[remove_shared_user_error,get_remove_shared_user_error]=useState(false)

  function handle_remove_Shared_User(){
    get_remove_shared_user_load(true)
    let value={
      folderID:route,
      user_to_remove:data?.email
    }
    axios.put(`${process.env.REACT_APP_URL}/api/folder_remove_shared_users/`,value, {
      headers: {
        Authorization: `Token ${userData.token}`,
        'Content-Type': 'application/json'
      }
     })
    .then(function (response) {
      handle_shared_user_equilizer(shared_user_equilizer+2)
      get_remove_shared_user_load(false)
      get_remove_shared_user_error(false)
    }).catch((error) => {
      get_remove_shared_user_load(false)
     if (error.response) {
      get_remove_shared_user_error(error?.response?.data?.detail||error?.response?.data?.error||"Error occured, please try again")
     } else if (error.request) {
      get_remove_shared_user_error("Error occured, please try again")
     } else {
      get_remove_shared_user_error("Error occured, please try again")
     }
  })
   }
  
   return(
    <>
    <div key={data.email} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
      <div><ReplyIcon style={{fontSize:"15px",color:"black"}}/>  {data.email}</div>
      {remove_shared_user_load?<CircularProgress size={20}/>:<Button><RemoveIcon onClick={handle_remove_Shared_User} style={{cursor:"ponter",fontSize:"15px",color:"red"}}/></Button>}
    </div>
    {remove_shared_user_error&&<div style={{margin:"5px 0 5px 0",color:"red"}}>{remove_shared_user_error}</div>}

    </>
  )
}

