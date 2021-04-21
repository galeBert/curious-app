import React, {useContext} from 'react'
import Sidebar from '../Sidebar'
import Notification from '../Notif'
import AddPosts from '../AddPost'
import { Col, Row } from 'antd'
import Navbar from '../NavBar'
import { UserContext } from '../../pages/authContext';


export default function Grid({children}) {

const {state, setState} = useContext(UserContext)
console.log(state);

        return (

        
            <Row>
            <Col span={5}>
                <Sidebar user={state} />
            </Col>
            <Col span={13}>
                {children}
            </Col>
            <Col span={6}>
                <Notification />
                <AddPosts />
            </Col>
          </Row>
        )
}