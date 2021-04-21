import React, { useContext } from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { useMutation, gql } from '@apollo/client';
import '../pages/style.css'
import { UserContext } from '../pages/authContext';
const { Option } = Select

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
};

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Option value="0">+62</Option>
      <Option value="01">+01</Option>
    </Select>
  </Form.Item>
);


const REGISTER_USER = gql`
    mutation registerUser(
      $username: String!
      $password: String!
      $birthday: String
      $gender: String
      $mobileNumber: String
      $email: String!
    ) {
      registerUser(registerInput: {
      username: $username
      password: $password
      birthday: $birthday
      gender: $gender
      mobileNumber: $mobileNumber
      email: $email
    }){
      id
        username
        email
        createdAt
        profilePicture
        birthday
        mobileNumber
        gender
        token
    }
  }
`
const  Register = (props) => {
  const {state, setState} = useContext(UserContext)
  console.log("aaaadawdqwdaw",state);
  
  const [registerUser, {loading, error, data}] = useMutation(REGISTER_USER)
  console.log("adakah datanya?", data, error );
  localStorage.setItem("token", data? data.registerUser.token : null )

  if(error) return "lol"
  if(data) {
    localStorage.setItem('tokeeen', data.registerUser.token)
    props.history.push("/")
  }

  const onFinish = values => {
    registerUser( { variables: {
                username: values.username, 
                password: values.password, 
                birthday: values.birthday,
                gender: values.gender,
                mobileNumber: values.mobileNumber, 
                email: values.email, 
              } 
            })
  };

    return (
        <div className="container">
        <h1> Register</h1>

        <Form  name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item name="username" id="username"  label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" id="email"  label="Email" rules={[{ type: 'email', required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        id="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      
      <Form.Item
        name="mobileNumber"
        label="mobileNumber"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="birthday" id="birthday"  label="birthday" rules={[{ required: true }]}>
       <DatePicker />
      </Form.Item>
      <Form.Item name="gender" id="gender"  label="gender" rules={[{ required: true }]}>
      <Select
          placeholder="Pick One"
          allowClear
        >
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      
      <Form.Item >
        <Button type="submit" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Button>
          Sign Up With Google
        </Button>
    </Form>
        </div>
        
    )
}

export default Register