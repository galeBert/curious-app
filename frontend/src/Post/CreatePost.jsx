import React, { useState } from 'react';
import { Modal, Button, Form, Upload } from 'antd';
import { PictureOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default function CreatePost(props) {


  const [state, setState] = useState({
    isModalVisible : false,
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: []
  });

  const showModal = () => {
    setState({
      ...state,
      isModalVisible: true
    });
  };

  const handleOk = () => {
    setState({
      ...state,
      isModalVisible: false
    });
  };

  const handleCancel = () => {
    setState({
      ...state,
      isModalVisible: false
    });
  };

  const handleCancelUpload = () => {
    setState({
      ...state,
      previewVisible: false
    });
  };

  const onFinish = values => {
      console.log(values);
  };

  const handlePreview = async file => {

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handleChange = ({ fileList }) => setState({...state, fileList });

  const { previewVisible, previewImage, fileList, previewTitle, isModalVisible } = state;

  const uploadButton = (
    <div>
      {fileList.length === 0 ? (<PictureOutlined />) : (
        <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      ) }
      
    </div>
  );

  
  console.log(fileList);
  return (
    <>
      <Button type="primary" onClick={showModal}>
       Post
      </Button>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
<Form onFinish={onFinish}>
  <Form.Item name="caption" id="caption">
      <TextArea showCount maxLength={100} />
  </Form.Item>
  <Form.Item name="picture" id="picure">
  <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          accept="image/*, video/*"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
  </Form.Item>
  <Form.Item >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
</Form>   
        
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancelUpload}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    </>
  );
};
