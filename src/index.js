// import dependencies and libraries
import "@babel/polyfill";
import "./style/index.scss";

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Controller from './core/Controller';

(async function initApp(){

    try {

        const controller = new Controller();
        const dataToLaunchApp = await controller.init();

        ReactDOM.render(
            <App
                controller={controller}
                activeStorms={dataToLaunchApp.activeStorms || []}
            />, 
            document.getElementById('appRootDiv')
        );

    } catch(err){
        console.error(err);
    }



})();