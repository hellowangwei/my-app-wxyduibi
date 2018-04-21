import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import App from '../component/questions'
import {Router, Route} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

const render = () => (
    ReactDOM.render(
            <Router  history={history}>
                <Route path="/" component={App}/>
            </Router>
        , document.getElementById('root'))
)
render();
