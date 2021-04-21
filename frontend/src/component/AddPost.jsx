import React, { useState } from 'react'
import { Modal, Button, Upload, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { storage } from '../pages/signInWithGoogle';
import { useMutation, gql } from '@apollo/client';
import '../App.css'

/////////GQL START////////////

const CREATE_POST = gql`
mutation createPost(
  $text: String!
  $media: String
  $position: Float!
) {
  createPost(
  text: $text
  media: $media
  position: $position
){
  id
  owner
  text
  media
  createdAt
  position
  commentCount
  likeCount
  likes{
    id
  }
  comments
  muted
}
}
`
/////////GQL FINISH///////////


export default function ModalPost() {

  const [createPost, { error, data}] = useMutation(CREATE_POST)

  const [state, setState] = useState({
    previewVisible: false,
    confirmLoading: false,
    visible: false,
    previewImage: '',
    previewTitle: '',
    fileList:[],
    latitude: '',
    longitude: '',
    uploaded:[]
  })
  
  const { visible, previewVisible, previewImage, fileList, previewTitle, latitude, longitude, uploaded} = state;

  ///////// location /////////
 function showPosition(position) {
  setState({
    ...state,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  })
}
navigator.geolocation.getCurrentPosition(showPosition)

//////////////////// Upload Photo Function Start//////////////////////////////////

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const handleCancel = () => setState({...state, previewVisible: false });

const handleCancelModal = () => {
  setState({
    ...state,
    visible: false
  });
};

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handleChange = ({ fileList }) => setState({
    ...state, 
    fileList 
    });


//////////////////// Upload Photo Function Finish/////////////////////////////////
  

  const showModal = () => {
    setState({
      ...state,
      visible: true,
      loading: false
    });
  };

  const onFinish = (value) => {
////////////////fungsi upload///////////////////
fileList.forEach(async (element) => {
  await storage.ref(`images/${element.originFileObj.name}`).put(element.originFileObj)
  .on(
      "state_changed",
      snapshot => () => {},
      error => {
          console.log(error);
      },
      () => {
          storage.ref("images")
          .child(element.originFileObj.name)
          .getDownloadURL()
          .then(url => {
            console.log(url, typeof(url));
              setState({
                ...state,
                uploaded: state.uploaded.push(url)
              })
              console.log("ini di state", uploaded, typeof(uploaded));
          })
      }
  )
});
/////update to database//////
console.log({text: value.text, media: uploaded, position: {latitude : latitude, longitude: longitude}});
// createPost( { variables: {text: value.text, media: uploaded, position: {latitude : latitude, longitude: longitude } } })
////////////////fungsi upload///////////////////

  };

  return (
    <div>
      <div className="ui circular outlined icon button fixed"
        style={{ position: 'fixed', backgroundColor: '#7958F5', borderRadius: '100%', right: '16%', bottom: '10%' }}
        onClick={showModal}>
        <i className="plus icon" style={{ color: 'white' }}></i>
      </div>
        <Modal
          visible={visible}
          title={[
            <p>Post to</p>,
            <div style={{ position: "absolute", marginTop: 15, marginLeft: 60, width: 150 }}>
              <h3 style={{ fontWeight: "bold" }}>Nearby</h3>
              <a style={{ fontSize: 12 }}>Wild Park, Melbourne</a>
            </div>,
            <div style={{ width: 45 }}>
              <a href="/"><p className="location" style={{ marginTop: 10 }} /></a>
            </div>
          ]}
          onOk={onFinish}
          onCancel={handleCancelModal}
          footer={null}
        >
        <Form  name="nest-messages" onFinish={onFinish}>
                      <Form.Item name="text"  >
                        <Input.TextArea />
                      </Form.Item>
                      <Form.Item name="foto" > 
                      <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                      >
                        {fileList.length >= 5 ? null : uploadButton}
                      </Upload>
                      </Form.Item>
                      <Button htmlType="submit" key="submit" type="primary" 
                        style={{ backgroundColor: '#7958f5', borderRadius: 20, position:"absolute", left:"86%", bottom:"3%", height:25, fontSize: 10}}  onClick={onFinish}>
                            Postnya
                        </Button>
                      </Form>
                      <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                      >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>

                      
        </Modal>
        
    </div>
  );
}
