import React, { Component, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'antd/dist/antd.css'
import 'semantic-ui-css/semantic.min.css'
import './App.css';

// Importing Pages & Components
import home from './pages/Home';
import login from './component/Login';
import register from './component/Register';
import upload from './component/UploadPicture';
import registerplus from './component/RegisterPLus';
import forgetPass from './component/forgetPass';
import singlePost from './Post/SinglePost';

import { Container } from 'semantic-ui-react';
import { UserContext } from './pages/authContext';
import landing from './component/landing';
import Grid from './component/Route/Grid';
import Visited from './component/Visited';
import Profile from './component/Profile';

function App() {
  const [state, setState] = useState({
    username: null,
    password: null,
    email: null,
    profilePicture: null,
    mobileNumber: null,
    birthday: null,
    gender: null,
    id: null,
    token: null,
  })

  return (
    <Router>
      <Container>
        <UserContext.Provider value={{ state, setState }}>
          <Grid>
            <Switch>
              <Route exact path="/" component={home} />
              <Route exact path="/landing" component={landing} />
              <Route exact path="/post/:id" component={singlePost} />
              <Route exact path="/login" component={login} />
              <Route exact path="/register" component={register} />
              <Route exact path="/register/forgetpassword" component={forgetPass} />
              <Route exact path="/upload" component={upload} />
              <Route exact path="/registerplus" component={registerplus} />
              <Route exact path="/visited" component={Visited} />
              <Route exact path="/profile" component={Profile} />
            </Switch>
          </Grid>
        </UserContext.Provider>
      </Container>
    </Router>
  );
}

export default App;