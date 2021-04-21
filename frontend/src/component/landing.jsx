import React from 'react'
import { signInWithGoogle } from '../pages/signInWithGoogle'
import { Button, Col, Row  } from 'antd';
import { Grid } from 'semantic-ui-react'
import './App.css'
import { Link } from 'react-router-dom';

export default function landing() {
    return (
      <div>
            <Row>
                    <Col span={12}>
                        <div className="landingimage" />
                        <div className="curiouslanding" />
                    </Col>
                    <Col span={12}>
                        <div>
                            <div style={{ marginLeft: 260, marginTop: 220 }}>
                                <h1 style={{ width: 160 }}>Welcome to Curious!</h1>
                                <button className="ui button" style={{ width: 343, height: 45,color: 'black', background:'#7F57FF', borderRadius: 5 }}>
                                <i class="facebook icon"></i>
                                Continue with Facebook
                                </button>

                                <button class="ui black basic button" style={{ width: 343, height: 45, marginTop:15, borderRadius: 5 }}  onClick={signInWithGoogle}>
                                    <i className="google icon"></i>
                                    Continue with Google
                                </button>

                                <Grid container justify="center" style={{ marginTop: 15 }}>
                                    <button class="ui secondary basic button" style={{ width: 164, height: 45, marginRight: 15, color: 'black' }}>
                                        Sign Up
                                    </button>
                                    <Link to="/login">
                                    <button class="ui secondary basic button" style={{ width: 164, height: 45, color: 'black'}} href="/login">
                                        Login
                                    </button>
                                    </Link>                                    
                                </Grid>
                            </div>

                            <p style={{ marginLeft: 265, marginTop: 30, fontSize: 14 }}>By signing up, you agree to our <span className="terms">Terms & Privacy Policy</span></p>
                            <p style={{ marginLeft: 380, marginTop: 310 }}>&copy; 2020 Curious</p>
                            <Grid style={{ marginLeft: 270, marginTop: 10 }}>


                                <Button type="text" style={{ fontSize: 8 }}>
                                    Terms of Service
                            </Button>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Privacy Policy
                            </Button>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Cookie Policy
                            </Button>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Ads Info
                            </Button>


                            </Grid>
                        </div>
                    </Col>
                </Row>
        </div>
    )
}
