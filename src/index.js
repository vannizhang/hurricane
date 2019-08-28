// import dependencies and libraries
import "@babel/polyfill";
import "./style/index.scss";

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Controller from './core/Controller';
import { urlFns, miscFns } from 'helper-toolkit-ts';

(async function initApp(){

    try {

        const isNarrowScreen = window.innerWidth <= 900;
        const isMobileDevice = miscFns.isMobileDevice();
        const isMobile = isMobileDevice || isNarrowScreen;
        const searchParams = urlFns.parseQuery();
        const isDemoMode = searchParams.demoMode ? true : false;

        const controller = new Controller();
        const dataToLaunchApp = await controller.init();

        ReactDOM.render(
            <App
                controller={controller}
                activeStorms={dataToLaunchApp.activeStorms || []}
                isDemoMode={isDemoMode}
                isMobile={isMobile}
            />, 
            document.getElementById('appRootDiv')
        );

    } catch(err){
        console.error(err);
    }



})();