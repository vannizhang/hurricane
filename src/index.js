// import dependencies and libraries
import "@babel/polyfill";
import "./style/index.scss";

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Controller from './core/Controller';
import { urlFns } from 'helper-toolkit-ts';

(async function initApp(){

    try {

        const searchParams = urlFns.parseQuery();
        const isDemoMode = searchParams.demoMode ? true : false;
        // console.log(searchParams, isDemoMode);

        const controller = new Controller();
        const dataToLaunchApp = await controller.init();

        ReactDOM.render(
            <App
                controller={controller}
                activeStorms={dataToLaunchApp.activeStorms || []}
                isDemoMode={isDemoMode}
            />, 
            document.getElementById('appRootDiv')
        );

    } catch(err){
        console.error(err);
    }



})();