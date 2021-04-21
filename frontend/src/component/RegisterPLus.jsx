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

const GOOGLE_LOGIN = gql`
mutation googleLogin(
    $displayName: String!
    $username: String!
    $email: String!
    $profilePicture: String!
    $mobileNumber: String!
    $birthday: String!
    $gender: String!
    $id: ID!
    $token: String!
) {
  googleLogin(
    displayName: $displayName
    username: $username
    email: $email
    profilePicture: $profilePicture
    mobileNumber: $mobileNumber
    birthday: $birthday
    gender: $gender
    id: $id
    token: $token
  )
}
`


const  Register = (props) => {
  console.log("lewat doang");
  const {state, setState} = useContext(UserContext)
  // if(!state.token) {
  //   props.history.push("/login")
  // }

   const [googleLogin] = useMutation(GOOGLE_LOGIN)

  const onFinish = values => {
    console.log(
      'username', values.username,
      'email', state.email,
      'profilePicture', state.profilePicture,
      'mobileNumber', values.mobileNumber,
      'birthday', values.birthday._d.toISOString(),
      'gender', values.gender,
      'id', state.id,
      'token', state.token);

    googleLogin( { variables: {
      displayName: state.username,
      username: values.username,
      email: state.email,
      profilePicture: state.profilePicture,
      mobileNumber: values.mobileNumber,
      birthday: values.birthday._d.toISOString(),
      gender: values.gender,
      id: state.id,
      token: state.token
    } })
  };


  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="0">+62</Option>
        <Option value="01">+01</Option>
      </Select>
    </Form.Item>
  );

    return (
        <div className="container">
    <h3>Hello, {state.username}</h3>
    <p>isi data data di bawah untuk menyelesaikan pendaftaran anda</p>

        <Form  name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
        <Form.Item
        name="mobileNumber"
        label="mobileNumber"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="username" id="username"  label="username" rules={[{ required: true }]}>
        <Input />
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

    </Form>
        </div>
        
    )
}

export default Register