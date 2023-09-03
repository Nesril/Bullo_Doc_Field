import React, { useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import { Typography, message } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { motion } from 'framer-motion'

export default function Index({ userData }) {
  const [data, setData] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const [filenames, setFilenames] = useState();

  const [errorMessage,setErrorMessage]=message.useMessage();
  const [messageApi, contextHolder] = message.useMessage();

  const allowedFileTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const [type, setType] = useState('summarize_low');

  const handleChange = (event) => {
    setType(event.target.value);
  };

  
  const[max_length,handle_max_length]=useState(1020)

   function valuetext(value) {
    handle_max_length(value.target.value)
    }

         //successfull message
  const success = (text) => {
          messageApi.open({
            type: 'success',
            content: text,
            duration: 5,
          });
    
        };
        
        //errror message
  const Error = (message) => {
         errorMessage.open({
           type: 'error',
           content: message,
           duration: 4,
         });
       
       };
  
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file && allowedFileTypes.includes(file.type)) {
      setLoading(true)
      setFilenames(file.name);
      setSummary("")
      const formData = new FormData();
      formData.append('file', file);
      formData.append('maxL', max_length);
      axios
      .post(`${process.env.REACT_APP_URL}/api/${type}/`, formData, {
        headers: {
          Authorization: `Token ${userData?.token}`, // Include the access token if required
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // Handle the response from the server
        setLoading(false)
        success("text successfully summerized")
        console.log(response.data);
        setSummary(response.data.summary_text)
        setFilenames("")
      })
      .catch((error) => {
        setFilenames("")
        setLoading(false)
        console.error(error);
        Error("Error occured, check your internate connection then please try again")
        // Error(error?.response?.data?.detail||error?.response?.data?.error||"Error occurred, please try again")
      });

    } else {
      setFilenames();
    }

  };


  const summarize = () => {
    setSummary("")
    const formData = new FormData();
    formData.append('data', data);
    formData.append('maxL', max_length);
    setLoading(true)
    console.log(max_length)
    axios
      .post(`${process.env.REACT_APP_URL}/api/${type}/`, formData, {
        headers: {
          Authorization: `Token ${userData?.token}`, // Include the access token if required
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // Handle the response from the server
        setLoading(false)
        success("text successfully summerized")
        console.log(response.data);
        setSummary(response.data.summary_text)
        setFilenames("")
      })
      .catch((error) => {
        setLoading(false)
        console.error(error);
        setFilenames("")
        Error("Error occured, check your internate connection then please try again")
        // Error(error?.response?.data?.detail||error?.response?.data?.error||"Error occurred, please try again")
      });
  };


  function Cancel(){
    setSummary("")
    setFilenames("")
    setData("")
  }

  return (
    <div className="dashboard-doc_summary">
          <h1>Document summaraization</h1>
          <div className='dashboard-doc_summary-instruction'>
             <ul>
                <li >in this section you can make a summarization for your documents or any kind of huge texts.</li>
                <li >we offerd to ways of getting summarization, the reason we make 2 ways for you is to enable you teke alternatives. </li>
                <li >please be carefull on handling the max length if it is beyond expected (should be bellow length of yor text)</li>
             </ul>
           </div> 
            {contextHolder}
             {setErrorMessage}
            
            <div className='dashboard-doc_summary-type'>
                <div>
                  <Box sx={{Width: 30 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">type</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={type}
                          label="Type"
                          onChange={handleChange}
                        >
                          <MenuItem value={"summarize_low"}>Medium</MenuItem>
                          <MenuItem value={"summarize_high"}>High</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                </div>
                <div>
                  <Box sx={{ width: 600 }}>
                    <Typography id="input-slider" gutterBottom>
                      Max length
                    </Typography>
                    <Slider
                      color="primary"
                      aria-label="Maximum length"
                      defaultValue={1020}
                      onChange={valuetext}
                      value={max_length}
                      valueLabelDisplay="auto"
                      step={50}
                      marks
                      min={50}
                      max={6000}
                    />
                  </Box>
                  </div>
                  
            </div>
            <div  className="dashboard-doc_summary_ways">
              <div style={{  display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "20px",
                          flexDirection: "column"}}>
                <div className="dashboard-doc_summary_ways-upload_file">
                      {!filenames? (
                        <label>  
                          <input type="file" onChange={handleFileChange} />
                          <div>
                            <AddIcon className="dashboard-folders-each-folders-addNewFile-icon" />
                          </div>
                          <div>Upload file you want to summerize </div>
                        </label>
                      ) : (
                        <>
                          {filenames}
                        </>
                      )}
                    </div>
              </div>
               <div style={{textAlign:"center"}}>
                  <textarea placeholder='text..' value={data} onChange={(e) => setData(e.target.value)} />
               </div>
    
  
            </div>
    
            <div className="dashboard-doc_summary_ways-button">
                  {loading?<CircularProgress/>:<Button disabled={data.length===0} onClick={summarize}>Summarize</Button>}
            </div>
            <motion.div
               initial={{opacity:0,scale:0}}
               whileInView={{opacity:1,scale:1}}
               transition={{duration:0.6}}
               style={{marginBottom:"40px"}} className="dashboard-doc_summary_ways-result">
                  {summary}
                  {summary&&<Button onClick={Cancel}>Cancel</Button>}
            </motion.div>
    </div>
  );
}