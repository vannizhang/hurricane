import './style.scss';

import React from 'react';

import PrecipChart from '../PrecipChart';
import WindChart from '../WindChart';

class InfoPanel extends React.Component {

    constructor(props){
        super(props);
    };

    render(){
        return (
            <div id='infoPanelDiv'>
                <div className='inline-block item-container '>
                    <PrecipChart 
                        id={'precipChartDiv'}
                        width={'300px'}
                        height={'100%'}
                        fieldNameForXAxis={'fromdate'}
                        fieldNameForYAxis={'value'}
                        data={this.props.precipData}
                    />
                </div>

                <div className='inline-block item-container '>
                    <WindChart 
                        id={'windChartDiv'}
                        width={'350px'}
                        height={'100%'}
                        fieldNameForXAxis={'fromdate'}
                        fieldNameForYAxis={'force'}
                        data={this.props.windGustData}
                    />
                </div>

            </div>
        );
    }
};

export default InfoPanel;