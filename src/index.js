import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/common/components/App';
import { hot } from 'react-hot-loader';

const AppWithHot = hot(module)(App);
const socket = io("http://localhost:3000");

ReactDOM.render(<AppWithHot />, document.getElementById('app'));
