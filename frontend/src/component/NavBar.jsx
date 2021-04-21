import { Button, Radio, Tabs } from 'antd';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { StickyContainer, Sticky } from 'react-sticky';
// Semantic
import { Container, Menu } from 'semantic-ui-react'
import { UserContext } from '../pages/authContext'
import { auth } from '../pages/signInWithGoogle' 

import './App.css'

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
    )}
  </Sticky>
);

export default function Login() {
const [nav, setNav] = useState({activeItem: null})

let {state, setState} = useContext(UserContext)

console.log("nav",state);
    const handleItemClick = (e, { name }) => {
        setNav({
            activeItem: name
        })
    }
     const signOutWithGoogle = () => {
        auth.signOut()
        localStorage.removeItem('tokeeen')
        setState({
          token: null
        })
      }
        const { activeItem } = nav
        return (
          <StickyContainer style={{position: "center"}}>
            <Menu pointing secondary size='massive'>
            
              <div className="centeredButton">
              <Radio.Group>
              <Radio.Button value="default" ant-click-animating-without-extra-node="true">Latest</Radio.Button>
                <Radio.Button value="default1" ant-click-animating-without-extra-node="true">Popular</Radio.Button>
              </Radio.Group>
              </div>
              
              </Menu>
              </StickyContainer>
        )
}