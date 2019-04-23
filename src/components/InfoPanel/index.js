import './style.scss';

import React from 'react';

import PrecipChart from '../PrecipChart';
import WindChart from '../WindChart';
import DonutChart from '../DonutChart';
import TwoLineLabel from './TwoLineLabel';

class InfoPanel extends React.Component {

    constructor(props){
        super(props);
    };

    render(){
        return (
            <div id='infoPanelDiv'>

                <div className='inline-block' style={{height: '100%', width: '350px'}}>
                    <div className='item-container'>
                        <div className='item-header'>
                            <h5>PRECIPITATION</h5>
                        </div>
                        <div className='item-content'>
                            <PrecipChart 
                                containerID={'precipChartDiv'}
                                containerWidth={'350px'}
                                containerHeight={'100%'}
                                fieldNameForXAxis={'fromdate'}
                                fieldNameForYAxis={'value'}
                                data={this.props.precipData}
                            />
                        </div>
                    </div>
                </div>

                <div className='inline-block' style={{height: '100%', width: '350px'}}>
                    <div className='item-container'>
                        <div className='item-header'>
                            <h5>WIND GUST</h5>
                        </div>
                        <div className='item-content'>
                            <WindChart 
                                containerID={'windChartDiv'}
                                containerWidth={'350px'}
                                containerHeight={'100%'}
                                fieldNameForXAxis={'fromdate'}
                                fieldNameForYAxis={'force'}
                                data={this.props.windGustData}
                            />
                        </div>
                    </div>
                </div>

                <div className='inline-block' style={{height: '100%', width: '350px'}}>
                    <div className='item-container'>
                        <div className='item-header'>
                            <h5>POPULATION</h5>
                        </div>
                        <div className='item-content flex-container'>
                            <div className='fixed-item text-center' style={{width: '100px'}}>
                                <TwoLineLabel 
                                    value={this.props.vehicleData ? this.props.vehicleData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.vehicleData ? this.props.vehicleData.fieldLabel : ''}
                                />
                            </div>
                            <div className='flexy-item' style={{height: '100%'}}>
                                <DonutChart 
                                    containerID={'popuChartDiv'}
                                    containerWidth={'100%'}
                                    containerHeight={'100%'}
                                    thicknessRatio={.7}
                                    fieldName={'fieldValue'}
                                    isCenterTextVisible={true}
                                    shouldShowValueInCenterWhenMouseOver={true}
                                    data={this.props.populationData.filter(d=>{ return d.fieldAlias !== 'Total Population' })}
                                    centerTextDefaultValue={this.props.populationData[0] ? this.props.populationData[0].fieldValue : ''}
                                />
                            </div>
                            <div className='fixed-item text-center' style={{width: '100px'}}>
                                <TwoLineLabel 
                                    value={this.props.disabilityData ? this.props.disabilityData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.disabilityData ? this.props.disabilityData.fieldLabel : ''}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='inline-block' style={{height: '100%', width: '350px'}}>
                    <div className='item-container'>
                        <div className='item-header'>
                            <h5>COMMUNICATION</h5>
                        </div>
                        <div className='item-content flex-container'>
                            <div className='fixed-item text-center' style={{width: '100px'}}>
                                <TwoLineLabel 
                                    value={this.props.vehicleData ? this.props.vehicleData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.vehicleData ? this.props.vehicleData.fieldLabel : ''}
                                />
                            </div>
                            <div className='flexy-item' style={{height: '100%'}}>
                                <DonutChart 
                                    containerID={'communicationChartDiv'}
                                    containerWidth={'100%'}
                                    containerHeight={'100%'}
                                    fieldName={'fieldValue'}
                                    data={this.props.languageData}
                                />
                            </div>
                            <div className='fixed-item text-center' style={{width: '100px'}}>
                                <TwoLineLabel 
                                    value={this.props.vehicleData ? this.props.vehicleData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.vehicleData ? this.props.vehicleData.fieldLabel : ''}
                                />
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        );
    }
};

export default InfoPanel;