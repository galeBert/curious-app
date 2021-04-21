import React, { useContext, useState } from 'react'
import { Form, Input, Button } from 'antd';
import { useMutation, gql } from '@apollo/client';
import '../pages/style.css'
import { UserContext } from '../pages/authContext';
import { auth } from '../pages/signInWithGoogle';
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
};


const FORGET_PASS = gql`
    mutation forgetPass(
      $email: String!
    ) {
      forgetPass(
      email: $email
    ){
    email
    }
  }
`
const  ForgetPass = () => {
  const [emailExist, setEmailExist] = useState({emailExist: true})
  const [forgetPass, {loading, error, data}] = useMutation(FORGET_PASS)
  console.log( data, error );
  if(error) return "lol"

  const onFinish = values => {

    let config = {
      url : "http://localhost:3000/login"
    }
 auth.sendPasswordResetEmail(values.email, config)
 .then(() => console.log("Password Reset"))
 .catch(() => setEmailExist({
   emailExist : false
 }))};

    return (
        <div className="container">
        <h1> Forget Password</h1>
{!emailExist.emailExist && <p>Email Dont Exist</p>}
        <Form  name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item name="email" id="email"  label="Email" rules={[{ type: 'email', required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item >
        <Button type="submit" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
        </div>
        
    )
}

export default ForgetPass