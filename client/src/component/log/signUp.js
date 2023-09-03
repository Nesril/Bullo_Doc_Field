import React, { useState } from 'react'
import "../../style/log.css"
import { Button,message  ,Checkbox, Select,Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {  KeyOutlined} from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

export default function Signup() {
 
  const [loadWhileSigningUp,setLoadWhileSigningUp]=useState(false)
 
  const [errorMessage,setErrorMessage]=message.useMessage();
  const [messageApi, contextHolder] = message.useMessage();
  let navigate=useNavigate()

   //successfull message
  const success = () => {
   messageApi.open({
     type: 'success',
     content: 'successfuly registerd',
     duration: 2,
   });
   setTimeout(()=>{
     navigate("/signIn")
   },2000)
 };
 
 //errror message
 const Error = (message) => {
  errorMessage.open({
    type: 'error',
    content: message,
    duration: 3,
  });

};

  const onFinish = async(values) => {
    setLoadWhileSigningUp(true)
   // let stringfyValue=JSON.stringify(values)
    axios.post(`${process.env.REACT_APP_URL}/api/register/`,values)
     .then(function (response) {
       //alert(response.data.data.msg)
       setLoadWhileSigningUp(false)
       success()
    }).catch((error) => {
      setLoadWhileSigningUp(false)
      if (error.response) {
        Error(error.response.data.msg||"Error occured please check your internate connection then try agaim")
      } else if (error.request) {
        Error("network error")
      } else {
        Error("network error")
      }
    });
 }
  const onFinishFailed = (errorInfo) => {
   // console.log('Failed:', errorInfo);
  };
 let [submitClicked,setSubmitClicked]=useState(false)
 function submitd(){
  setSubmitClicked(true)
 }

//bello 700px
  return (
    <div className={`log-signUp-container`}>
      <div className='log-signUp'>
         <h2>Sign up</h2>
         <section className='log-signUp-form'>
            {contextHolder}
            <Form
              layout="vertical"
              name="basic"
              labelCol={{
                span: 23,
              }}
              wrapperCol={{
                span: 50,
              }}
              style={{
                Width:800,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
          >
            <div className='log-signUp-form-name_email'>
                <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                  <Input size="middle" placeholder='username'  prefix={<UserOutlined />} />
                </Form.Item>
              
                <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        type:"email",
                        message: '',
                      },
                    ]}
                  >
                  <Input size="middle" placeholder='email' prefix={<UserOutlined />} />
                </Form.Item>

            </div>

            <div className='log-signUp-form-password'>
              
               <Form.Item
                    name="password"
                    
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password placeholder='password'  size="middle"  prefix={<KeyOutlined />}/>
              </Form.Item>
              
              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('The two passwords that you entered do not match!');
                    },
                  })
                ]}
              >
                <Input.Password placeholder='Confirm Password'  size="middle"  prefix={<KeyOutlined />}/>
              </Form.Item>

            </div>

              <Form.Item
                    name="type"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                    hasFeedback
                  >
                    <Select placeholder="type">
                        <Select.Option value="person">Person</Select.Option>
                        <Select.Option value="organization">Organization</Select.Option>
                    </Select>
              </Form.Item>
               
              <Form.Item
                   name="about"
                       >
                           <Input.TextArea rows={5} placeholder='about'/>
                </Form.Item>

             <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Checkbox>Remember me</Checkbox>
             </Form.Item>
             
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
               {loadWhileSigningUp?
                <CircularProgress size={20}/>
                  :
                 <Button type="primary" htmlType="submit" onClick={submitd}>
                   Create
                </Button>
               }
              </Form.Item>
           </Form>
           
           <div style={{marginTop:"-20px",paddingBottom:"15px"}}>
           
            {setErrorMessage}
              <Link href='/signIn'>{!submitClicked?"already have an account":"Sign In"}</Link>
          </div>
       </section>
      </div>
    </div>
  )
}
