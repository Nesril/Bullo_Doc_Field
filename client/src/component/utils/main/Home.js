import React,{useEffect, useState} from 'react'
import {motion } from "framer-motion"
import {
   AutoComplete,
   Button,
   Cascader,
   Checkbox,
   Col,
   Form,
   Input,
   InputNumber,
   Row,
   Select,
 } from 'antd';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
export default function Home() {
  let text="Smarter Document Processing for Streamlined Workflows"
  let delay=100
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
  
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  const onFinish = (values) => {
   console.log('Received values of form: ', values);
 };
  return (
  <div className='Home'>
      <div className='Home-topView'  id='home'>
  
          <div className='Home-topView-left'>
              <div  className='Home-topView-left-bottom'><img src='/folder-with-personal-files-resume-cv-file-vector-illustration_213497-1883.jpg'/></div>
              <motion.div  initial={{ opacity:0,y:100 }}
                     whileInView={{ opacity: 1,y:0 }}
                     viewport={{once:true}}
                     transition={{  duration: 2 }}  className='Home-topView-left-top'><img src='/online-archive-documents-base-data-storage-information-search-personal-records-access-base-user-with-magnifying-glass-cartoon-character-vector-isolated-concept-me.jpg'/>
               </motion.div>
             
          </div>
          <div className='Home-topView-right'>
          <motion.div  initial={{ opacity:0,scale:0 }}
                     whileInView={{ opacity: 1,scale:1. }}
                     viewport={{once:true}}
                     transition={{  duration: 8 }}  className='Home-topView-slogan'>
                        {currentText}</motion.div>
            <div className='Home-topView-slogan-underImage'>
              <div><img src='pdf.png' width={30}/></div>
              <div><img src='ppt.png' width={30}/></div>
              <div><img src='word.jpg' width={30}/></div>
            </div>
          </div>
    
      </div>

      <div className='Home-about'>
          <h1 name="about">About us</h1>
          <div>
            <ul>
            <motion.li  initial={{ opacity:0,y:100 }}
                     whileInView={{ opacity: 1,y:0. }}
                     viewport={{once:true}}
                     transition={{  duration: 0.6 }} 
               >  Bullo Doc Field, developed by <b>Hawd Tech</b>, is an intelligent software designed to enhance your document-related tasks. With its advanced capabilities, it offers a wide range of features to simplify your workflow and streamline your document processing.
              </motion.li>
              
              <motion.li  initial={{ opacity:0,y:100 }}
                     whileInView={{ opacity: 1,y:0. }}
                     viewport={{once:true}}
                     transition={{  duration: 0.7 }} 
                >  At Bullo Doc Field, our mission is to empower individuals and organizations with efficient and intelligent document management solutions. We understand that dealing with large volumes of documents can be time-consuming and challenging. That's why we've built Bullo Doc Field to provide a seamless experience for handling various document-related tasks.</motion.li>
               
               <motion.li  initial={{ opacity:0,y:100 }}
                     whileInView={{ opacity: 1,y:0. }}
                     viewport={{once:true}}
                     transition={{  duration: 0.8 }} 
                >  Our software leverages cutting-edge artificial intelligence, natural language processing, and machine learning algorithms to deliver accurate and insightful results. Whether you need to analyze document similarity, generate concise summaries, convert text to natural-sounding speech, or transcribe spoken words to text, Bullo Doc Field has you covered.
                  </motion.li>
                
                  <motion.li  initial={{ opacity:0,y:100 }}
                     whileInView={{ opacity: 1,y:0. }}
                     viewport={{once:true}}
                     transition={{  duration: 0.9 }} 
                >  We take pride in our commitment to innovation and user-centric design. Our team of experienced professionals is dedicated to continuously improving Bullo Doc Field, ensuring it stays ahead of the curve and meets the evolving needs of our users.
                </motion.li>
            
             
                <motion.li  initial={{ opacity:0,y:100 }}
                     whileInView={{ opacity: 1,y:0. }}
                     viewport={{once:true}}
                     transition={{  duration: 1.1 }} 
                >  
                   Discover the power of Bullo Doc Field and unlock new levels of productivity and efficiency in your document processing. Join the growing number of individuals and businesses who rely on Bullo Doc Field to simplify their workflows and gain valuable insights from their documents.

                 </motion.li>
               
                 <motion.li  initial={{ opacity:0,y:100 }}
                     whileInView={{ opacity: 1,y:0. }}
                     viewport={{once:true}}
                     transition={{  duration: 1.2 }} 
                >    
                  Contact us today to learn more about how Bullo Doc Field can revolutionize the way you handle documents.
                  </motion.li>
            </ul>
          </div>

      </div>

      <div   className='Home-services'  >
         <h1 name='services'>Services</h1>
          <div className='Home-services-allbox'>
             
               <div className='Home-services-each'>
                   <motion.div  initial={{ opacity:0,scale:0 }}
                     whileInView={{ opacity: 1,scale:1. }}
                     transition={{  duration: 0.7 }}
                    
                    className='Home-services-each-right'>
                        <img src='documentation-management-colorful-icon-female-cartoon-character-putting-document-big-yellow-folder-files-storage-sorting-organization_335657-846.jpg'/>
                   </motion.div>
                   <motion.div  
                        initial={{ opacity:0,y:200,x:-100 }}
                        whileInView={{ opacity: 1,y:0,x:0 }}
                        transition={{  duration: 0.8 }}
                        viewport={{once:true}}
                        className='Home-services-each-left'>
                      <h2>Document Similarity Analysis</h2>
                      <div> Utilize advanced algorithms to compare and analyze the similarity between different documents. Identify common patterns, themes, or duplications for efficient document organization and analysis.</div>
                      <div>
                         <h3> Use cases</h3>
                         <ul>
                            <li>Research Paper Comparison</li>
                            <li>Plagiarism Detection</li>
                            <li>Grant Proposal Evaluation</li>
                            <li>Curriculum Development</li>
                            <li>Intellectual Property Research</li>
                            <li>Literature Review Automation</li>
                            <li>Data Set Comparison</li>
                            <li>Content Recommendation Systems</li>
                            <li>and related areas</li>
                          </ul>
                        </div>
                   </motion.div>
               </div>

               <div className='Home-services-each'>
                   <motion.div  
                        initial={{ opacity:0,y:-200,x:100 }}
                        whileInView={{ opacity: 1,y:0,x:0 }}
                        transition={{  duration: 0.8 }}
                        viewport={{once:true}}
                        className='Home-services-each-left'>
                        <h3>Summarization</h3>
                        <div> Extract key information and generate concise summaries from lengthy documents. Save time and effort by quickly grasping the main points without reading through the entire document.</div>
                        <div>
                         <h3> Use cases</h3>
                         <ul>
                            <li>Research Paper Summaries</li>
                            <li>News Aggregation</li>
                            <li>Meeting Minutes</li>
                            <li>Content Curation</li>
                            <li>and other related areas</li>
                          </ul>
                     </div>
                     </motion.div>
                     <motion.div  
                         initial={{ opacity:0,scale:0 }}
                         whileInView={{ opacity: 1,scale:1 }}
                         transition={{  duration: 0.7 }}
                        className='Home-services-each-right'>
                      <img src='automatic-text-summarization-an-emerging-trend-in-machine-learning-1024x536.jpg'/>
                    </motion.div>
            
               </div>
              
    
          </div>
         
      </div>

      <div className="home-contact" >
         <h1 name="Contact">Contact Us</h1>
         <div  className="home-contact-info">
             <div><a href="mailto:nesredinhaji@gmail.com"><MailIcon style={{color:"brown",fontSize:"40px"}}/></a></div>
             <div><a href="tel:+251932751336"><PhoneIcon style={{color:"green",fontSize:"40px"}}/></a></div>
             <div><a href="https://www.linkedin.com/in/nesril03/"><LinkedInIcon style={{color:" rgb(88, 126, 197)",fontSize:"40px"}}/></a></div>
         </div>
         <div className='home-contact-emailSend'>
            <Form
               name="normal_login"
               className="login-form"
               initialValues={{
               remember: true,
               }}
               onFinish={onFinish}
               scrollToFirstError
            >
            <div className='home-contact-name_email'>
                  <Form.Item
                        name="email"
                        rules={[
                           {
                              type: 'email',
                              message: 'The input is not valid E-mail!',
                           },
                           {
                              required: true,
                              message: 'Please input your E-mail!',
                           },
                        ]}
                        >
                     <Input placeholder='E-mail'/>
                  </Form.Item>

                  <Form.Item
                     name="name"
                     >
                        <Input placeholder='fullname'/>
                  </Form.Item>
             </div>  
             <div className='home-contact-emailField'> 
                  <Form.Item
                        name="subject"
                        rules={[
                           {
                              required: true,
                              message: 'Subject is required',
                           },
                        ]}
                     
                        >
                           <Input placeholder='subject'/>
                     </Form.Item>

                     <Form.Item
                           name="body"
                           rules={[
                              {
                                 required: true,
                                 message: 'Body is required',
                              },
                           ]}
                           >
                           <Input.TextArea rows={5} placeholder='body'/>
                     </Form.Item>
               </div>

                  <Form.Item>
                     <Button type="primary" htmlType="submit">
                        Send
                     </Button>
                  </Form.Item>
                  
               
            </Form>
         </div>

      </div>
    </div>
  )
}

{/*
           <div className='Home-services-each'>
                 <motion.div  initial={{ opacity:0,scale:0 }}
                     whileInView={{ opacity: 1,scale:1. }}
                     transition={{  duration: 0.7 }}
                    className='Home-services-each-right'>
                      <img src='users-translating-speech-with-smartwatch-digital-translator-portable-translator-electronic-language-translator-concept-pinkish-coral-bluevector-isolated-illustrat.avif'/>
                   </motion.div>
                   <motion.div  
                        initial={{ opacity:0,y:200,x:-100 }}
                        whileInView={{ opacity: 1,y:0,x:0 }}
                        transition={{  duration: 0.8 }}
                        className='Home-services-each-left'>
                      <h3>Text-to-Voice Conversion</h3>
                      <div> Transform written text into natural-sounding speech. Enjoy the convenience of listening to your documents instead of reading them, enhancing accessibility and enabling multitasking.</div>
                      <div>
                         <h3> Use cases</h3>
                         <ul>
                            <li>Accessibility</li>
                            <li>Language Learning</li>
                            <li>Multimedia Presentations</li>
                            <li>Audiobook Production</li>
                            <li>and other related areas</li>
                          </ul>
                     </div>
                   </motion.div>
        
               </div>
                     
               <div className='Home-services-each'>
               <motion.div  
                        initial={{ opacity:0,y:-200,x:100 }}
                        whileInView={{ opacity: 1,y:0,x:0 }}
                        transition={{  duration: 0.8 }}
                        className='Home-services-each-left'>
                      <h3>Voice-to-Text Conversion</h3>
                      <div> Convert spoken words or audio recordings into accurate written text. Effortlessly transcribe voice recordings or capture notes through voice input, simplifying documentation and content creation.</div>
                      <div>
                         <h3> Use cases</h3>
                         <ul>
                            <li>Transcription Services</li>
                            <li>Note Taking</li>
                            <li>Dictation Software</li>
                            <li>Language Translation</li>
                            <li>and other related areas</li>
                          </ul>
                     </div>
                   </motion.div>
                   <motion.div  
                         initial={{ opacity:0,scale:0 }}
                         whileInView={{ opacity: 1,scale:1 }}
                         transition={{  duration: 0.7 }}
                        className='Home-services-each-right'>
                      <img src='speech-text-abstract-concept-illustration-multi-language-speech-recognizer-convert-speech-text-voice-text-software-voice-recognition-technology-translation_335657.avif'/>
                   </motion.div>
               </div>
          
*/}