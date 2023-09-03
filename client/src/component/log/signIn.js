import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input,message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {  KeyOutlined} from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
  useNavigate,
} from "react-router-dom";
import "../../style/log.css"

import CircularProgress from '@mui/material/CircularProgress';
export default function  SignIn({setUserData,userData}) {
  const [loading,setLoading]=useState(false)
  let navigate=useNavigate()
  

  const [errorMessage,setErrorMessage]=message.useMessage();
  const [messageApi, contextHolder] = message.useMessage();
   //successfull message
   const success = () => {
    messageApi.open({
      type: 'success',
      content: 'successfuly logged in',
      duration: 1,
    });
      navigate("/")

  };
  
  //errror message
  const Error = (message) => {
   errorMessage.open({
     type: 'error',
     content: message,
     duration: 2,
   });
 
 };

  const onFinish = async(values) => {
    setLoading(true)
    axios.post(`${process.env.REACT_APP_URL}/api/login/`,values)
     .then(function (response) {
      setLoading(false)
      setUserData(response.data)
      if(values){
        success()
      }
    }).catch((error) => {
      setLoading(false)
      if (error.response) {
        Error(error.response.data.msg||"Error occured, please try again")
      } else if (error.request) {
        Error("Error occured, please try again")
      } else {
        Error("Error occured, please try again")
      }
      
    });
 }

  const onFinishFailed = (errorInfo) => {
    //console.log('Failed:', errorInfo);
  };
 
  return (
  <div className='log-signIn-container'>
      <div className='log-signIn'>
          <h2  className='log-signInTitle'>Sign in</h2>
          {setErrorMessage}
          {contextHolder}
          <section className='log-signInForm'>
              <Form
                layout="vertical"
                name="basic"
                labelCol={{
                  span: 28,
                }}
                wrapperCol={{
                  span: 86,
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
              <Form.Item
                  label="email or username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your email or udername!',
                    },
                  ]}
                >
                <Input size="middle"  prefix={<UserOutlined />} />
              </Form.Item>
                <Form.Item
                  label="password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your password!',
                    },
                  ]}
                >
                  <Input.Password size="middle" placeholder="password" prefix={<KeyOutlined />} />       
                </Form.Item>
                <Form.Item wrapperCol={{
                  offset: 8,
                  span: 16,
                }}>
                      <Link href="/forget" >
                          Forgrt Password
                          </Link> 
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
            
                  {loading?<CircularProgress size={24} color="success"/>: <Button type="primary" htmlType="submit">Submit </Button>}
                
                </Form.Item>
              </Form>
              <div>
                  <Link href='/signUp'>Sign up</Link>
              </div>
          </section>
        
      </div>
  </div>
  )
}
