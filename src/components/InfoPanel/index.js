import './style.scss';

import React from 'react';

import PrecipChart from '../PrecipChart';

class InfoPanel extends React.Component {

    constructor(props){
        super(props);
    };

    render(){
        return (
            <div id='infoPanelDiv'>

                <PrecipChart 
                    id={'precipChartDiv'}
                    width={'300px'}
                    height={'100%'}
                    fieldNameForXAxis={'fromdate'}
                    fieldNameForYAxis={'value'}
                    data={this.props.precipData}
                />

            </div>
        );
    }
};

export default InfoPanel;