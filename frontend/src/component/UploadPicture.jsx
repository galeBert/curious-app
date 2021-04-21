import React, { useState } from 'react'
import { storage } from '../pages/signInWithGoogle'
import { Upload, Modal, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


export default function UploadPicture(props) {
  console.log("mauliatdulu ah", props);
    const [image, setImage] = useState({
        picture: null,
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: []
    });

   const { previewVisible, previewImage, fileList, previewTitle } = image;

  const handleChange = ({ fileList }) => {
       console.log(fileList);
       setImage({
            ...image,
             fileList 
            }
        )
    };

   const handleUpload = () => {
     fileList.forEach(element => {
        storage.ref(`images/${element.originFileObj.name}`).put(element.originFileObj)
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
                    console.log(url);
                })
            }
        )
    }); 
   };
   const handleCancel = () => this.setImage({ ...image, previewVisible: false });

   const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setImage({
        ...image,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

   console.log(image.picture);

   const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
    return (
        <div>
            <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        <Button onClick={handleUpload}>Upload</Button>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        </div>
    )
}