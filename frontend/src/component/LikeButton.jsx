import React from 'react'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { Button } from 'antd';
import './App.css'

export default function LikeButton() {
    return (
 
        <div class="ui labeled" tabindex="0">
            <div style={{ marginLeft: 35, marginRight: 5 }}>
                <div class="ui basic label float"
                    style={{ height: 25, borderRadius: 5, top: -3, border: '1px black solid', marginLeft: -10, marginRight: -20, position: 'relative', backgroundColor: 'white' }}>
                    <p style={{ marginTop: -4, marginLeft: 5 }}>894 likes</p>
                </div>
            </div>

            <div style={{ position: 'absolute', marginTop: -32 }}>
                    <Button shape="circle" className="likeButton"  icon={<HeartOutlined />} />
            </div>
        </div>
    )
}