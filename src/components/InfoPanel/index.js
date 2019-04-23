import './style.scss';

import React from 'react';

import PrecipChart from '../PrecipChart';
import WindChart from '../WindChart';
import DonutChart from '../DonutChart';

class InfoPanel extends React.Component {

    constructor(props){
        super(props);
    };

    render(){
        return (
            <div id='infoPanelDiv'>
                <div className='inline-block item-container'>
                    <PrecipChart 
                        containerID={'precipChartDiv'}
                        containerWidth={'350px'}
                        containerHeight={'100%'}
                        fieldNameForXAxis={'fromdate'}
                        fieldNameForYAxis={'value'}
                        data={this.props.precipData}
                    />
                </div>

                <div className='inline-block item-container'>
                    <WindChart 
                        containerID={'windChartDiv'}
                        containerWidth={'350px'}
                        containerHeight={'100%'}
                        fieldNameForXAxis={'fromdate'}
                        fieldNameForYAxis={'force'}
                        data={this.props.windGustData}
                    />
                </div>

                <div className='inline-block item-container'>
                    <DonutChart 
                        containerID={'popuChartDiv'}
                        containerWidth={'150px'}
                        containerHeight={'100%'}
                        thicknessRatio={.7}
                        fieldName={'fieldValue'}
                        data={this.props.populationData.filter(d=>{ return d.fieldLabel })}
                    />
                </div>

                <div className='inline-block item-container'>
                    <DonutChart 
                        containerID={'communicationChartDiv'}
                        containerWidth={'150px'}
                        containerHeight={'100%'}
                        fieldName={'fieldValue'}
                        data={this.props.languageData}
                    />
                </div>

            </div>
        );
    }
};

export default InfoPanel;