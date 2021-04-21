import React, { useState } from "react";
import '../App.css'
import { Layout, Menu, List, Avatar } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, SettingOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Photo from '../images/pin-svg-25px.svg'
import Blank from '../images/blank.jpg'


const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

export default function Sidebar(props) {

  const { user } = props

  console.log("wafawfawfaewfawfa",user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  return (
    <React.Fragment >
      {/* Sidebar */}
      <div className="sidebarcoy" style={{ position: 'fixed', backgroundColor: 'white', zIndex: 1}} >
        <Sider className="site-layout-background" width={230} style={{backgroundColor: 'white'}}>
        <div style={{width: 60}}>
          <Link to="/"><div className="profilefoto" style={user.profilePicture? {backgroundImage: `url(${user.profilePicture}`} : {backgroundImage: `url(${Blank})` }} /></Link>
        </div>

        <h3 style={{ marginTop: 15, marginBottom: -1}}>{user.username? user.username : "My Account"}</h3>
          <List.Item.Meta
          title={<a href="https://ant.design"> <  img src={Photo} style={{width:20, marginTop: -5}}/>Albert Park, Melbourne</a>}
        />
          <Menu
            mode="inline"
            defaultSelectedKeys={['NearBy']}
            defaultOpenKeys={['NearBy']}
            style={{ height: '100%', border: 'none'}}
          >
            <Menu.Divider />

            <Menu.Item key="NearBy" icon={<UserOutlined />}>
            <Link to="/">
              NearBy
              </Link>
            </Menu.Item>
            <Menu.Item key="Search" icon={<SearchOutlined />}>
              Search
            </Menu.Item>
            
            <SubMenu key="Room" icon={<LaptopOutlined />} title="Available Room">
              <Menu.Item key="Room1">April Mop</Menu.Item>
              <Menu.Item key="Room2">Sad Story</Menu.Item>
            </SubMenu>
            <Menu.Item key="Visited" icon={<StarOutlined />}>
              <Link to="/visited">
              Visited Places
              </Link>
            </Menu.Item>
            <Menu.Item key ="Sub" icon={<NotificationOutlined />}>
              Subscribed Posts
            </Menu.Item>
            <Menu.Item key="Muted" icon={<SettingOutlined />}>
              Muted Posts
            </Menu.Item>

            <Menu.Item key="Settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <div className="curious" />

      </div>
    </React.Fragment>
  )
}
