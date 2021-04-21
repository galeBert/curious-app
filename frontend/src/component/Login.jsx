import React, { useContext, useEffect } from 'react'
import { auth, signInWithGoogle } from '../pages/signInWithGoogle'
import { Form, Input } from 'antd';
import { useMutation, gql } from '@apollo/client';
import { UserContext } from '../pages/authContext';
import './App.css'
import { Link } from 'react-router-dom';

const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
  };

  const LOGIN_USER = gql`
    mutation login(
      $username: String!
      $password: String!
    ) {
      login(
      username: $username
      password: $password
    ){
    id
    email
    createdAt
    profilePicture
    token
    username
    }
  }
`
const CHECK_GOOGLE_USER = gql`
mutation googlecheckDatabase(
  $username: String!
) {
  googlecheckDatabase(
  username: $username
)
}
`
export default function Login(props) {

  const {state, setState} = useContext(UserContext)

useEffect(() => {
  auth.onAuthStateChanged(userAuth => {
   
    if(!userAuth){
      return
    } else {
      const { displayName, email, photoURL, uid, _lat} = userAuth
      localStorage.setItem('tokeeen', _lat)
      googlecheckDatabase( { variables: {username: displayName } })
      setState({
        username: displayName,
        email,
        profilePicture: photoURL,
        id: uid,
        token: _lat
      })
      
  }
    }
  )    
}, [signInWithGoogle])

    const [login, { error, data}] = useMutation(LOGIN_USER)
    console.log(data);
    const [googlecheckDatabase] = useMutation(CHECK_GOOGLE_USER,{
      update(_, { data: { googlecheckDatabase }}){
        console.log(googlecheckDatabase);
        
        if(googlecheckDatabase === "true"){
          props.history.push("/")
        } else {
          props.history.push("/registerplus")
        }
      }
    })
    

    localStorage.setItem("token", data? data.login.token : null )
    const onFinish = values => {
        login( { variables: {username: values.username, password: values.password } })
      };

    return (
      <>
      <div>
    <div className="curious" style ={{marginLeft: 780, marginTop: 100}}/>
    <div class="ui card container" style={{width: 447, marginTop: 30,paddingTop: 30, padding: 30}}>
    <div class="content">
    
    <Form
      name="basic"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
    <Form.Item
    name="username"
    rules={[
    {
        required: true,
        message: 'Please input your email or username!',
    },
    ]}
    >
    <Input placeholder="Email / Username" />
    </Form.Item>

    <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
    <Input.Password placeholder="Password" />
    </Form.Item>

    <Form.Item>
    <button class="ui facebook button" type="submit" style={{backgroundColor: '#7F57FF', width: 359, height: 40}}>
    Login
    </button>
    </Form.Item>
    </Form>
    <a href="/" style={{ color:'black'}}>
    <p style={{textAlign:'center'}}>Forgot Password?</p>
    </a>
    </div>
    </div>
    <p style={{textAlign:'center', marginTop:30, fontSize:14}}>Don't have an account yet? <Link to="/register" style={{fontWeight:'bold'}}> Sign Up</Link> now</p>

    </div>
      </>
        
    )
}