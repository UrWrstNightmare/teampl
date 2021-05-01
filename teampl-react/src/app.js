//React
import React from 'react';
//Component APIS
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect,
    useLocation,
    useHistory
} from 'react-router-dom';
//Pages
import {Landing} from "./pages/landing";
import {Login} from './pages/login';
import {UserHome} from './pages/userHome';
//Styles
import './css/App.css';

import UserProvider, {firebaseAuth} from "./providers/UserProvider";

function App({location}) {
    return (
        <Router>
            <UserProvider>
                <Switch>
                    <Route exact path='/'>
                        <Landing/>
                    </Route>
                    <Route exact path='/login.js'>
                        <Login/>
                    </Route>
                    <Route exact path='/home.js'>
                        <UserHome/>
                    </Route>
                </Switch>
            </UserProvider>
        </Router>
     );
}

export default App;