import React from 'react'
import { Card, List, Row, Col, Menu, Dropdown } from 'antd';
import LikeButton from '../component/LikeButton'
import CommentButton from '../component/CommentButton';
import RepostButton from '../component/RepostButton';
import '../component/App.css'
import Photo from '../images/pin-svg-25px.svg'
import { EllipsisOutlined } from '@ant-design/icons';


const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);


export default function PostCard(props) {
    const { loading, posts, token } = props;

    return (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={posts}
          renderItem={item =>(
            <List.Item
              key={item.id}
              actions={
                !loading && [
                 <LikeButton />,
                 <CommentButton />,
                 <RepostButton />
                  ]
              } 
            > 
                <List.Item.Meta
                extra={<a href="#" />}
                  title={<div>
                    <Row>
                      <Col span={12}>
                      <a href={`/post/${item.id}`}><img src={Photo} style={{width: 20}}/>{item.owner}</a>
                      </Col>
                      <Col span={12} style={{textAlign: "right"}}>
                        <Dropdown overlay={
                          <Menu>
                          <Menu.Item key="0">
                            Subscribe
                          </Menu.Item>
                          <Menu.Item key="1" onClick={e=> console.log(e)}>
                            Mute
                          </Menu.Item>
                          <Menu.Item key="3">
                            Report
                          </Menu.Item>
                        </Menu>
                        } trigger={['click']} placement="bottomRight">
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          <EllipsisOutlined />
                        </a>
                      </Dropdown>
                      </Col>
                  </Row>
                    </div>}
                  description={<div style={{ marginTop: -9}}>{item.createdAt}</div>}
                >
                </List.Item.Meta>
                {item.text}
            </List.Item>
          )}
        />
    );
  }
