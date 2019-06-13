import './style.scss';

import React from 'react';

import PrecipChart from '../PrecipChart';
import WindChart from '../WindChart';
import DonutChart from '../DonutChart';
import TwoLineLabel from './TwoLineLabel';
import HorizontalLegend from '../HorizontalLegend';

const styles = {
    itemWrap: { 
        // height: '220px', 
        width: '100%',
        marginBottom: '2rem'
    },
    sideLabel: {width: '100px'}
}

class InfoPanel extends React.Component {

    constructor(props){
        super(props);
    };

    render(){
        const isHide = !this.props.isVisible ? 'hide' : '';

        return (
            <div id='infoPanelDiv' className={`padding-trailer-1 ${isHide}`}>

                <div className='info-panel-item-wrap' style={styles.itemWrap}>
                    <div className='item-container'>
                        <div className='item-header'>
                            <h5>PRECIPITATION</h5>
                        </div>
                        <div className='item-content'>
                            <PrecipChart 
                                containerID={'precipChartDiv'}
                                containerWidth={'100%'}
                                containerHeight={'180px'}
                                fieldNameForXAxis={'fromdate'}
                                fieldNameForYAxis={'value'}
                                data={this.props.precipData}
                            />
                        </div>
                    </div>
                </div>

                <div className='info-panel-item-wrap' style={styles.itemWrap}>
                    <div className='item-container'>
                        <div className='item-header'>
                            <h5>WIND GUST</h5>
                        </div>
                        <div className='item-content'>
                            <WindChart 
                                containerID={'windChartDiv'}
                                containerWidth={'100%'}
                                containerHeight={'180px'}
                                fieldNameForXAxis={'fromdate'}
                                fieldNameForYAxis={'force'}
                                data={this.props.windGustData}
                            />
                        </div>
                    </div>
                </div>

                <div className='info-panel-item-wrap' style={styles.itemWrap}>
                    <div className='item-container'>

                        <div className='item-header'>
                            <h5>POPULATION</h5>
                        </div>

                        <div className='item-content flex-container'>
                            <div className='fixed-item text-center' style={styles.sideLabel}>
                                <TwoLineLabel 
                                    value={this.props.vehicleData && this.props.vehicleData.fieldValue ? this.props.vehicleData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.vehicleData && this.props.vehicleData.fieldLabel ? this.props.vehicleData.fieldLabel : ''}
                                />
                            </div>
                            <div className='flexy-item' style={{height: '100%'}}>
                                <DonutChart 
                                    containerID={'popuChartDiv'}
                                    containerWidth={'100%'}
                                    containerHeight={'180px'}
                                    thicknessRatio={.7}
                                    fieldName={'fieldValue'}
                                    isCenterTextVisible={true}
                                    shouldShowValueInCenterWhenMouseOver={true}
                                    data={this.props.populationData.filter(d=>{ return d.fieldAlias !== 'Total Population' })}
                                    centerTextDefaultValue={this.props.populationData[0] ? this.props.populationData[0].fieldValue : ''}
                                />
                            </div>
                            <div className='fixed-item text-center' style={styles.sideLabel}>
                                <TwoLineLabel 
                                    value={this.props.disabilityData ? this.props.disabilityData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.disabilityData ? this.props.disabilityData.fieldLabel : ''}
                                />
                            </div>
                        </div>

                        <div className='item-footer'>
                            <HorizontalLegend 
                                data={
                                    this.props.populationData
                                    .filter(d=>{ return d.fieldAlias !== 'Total Population' })
                                    .map(d=>{ 
                                        const label = d.fieldLabel;
                                        const color = d.color;
                                        return { label, color };
                                    })
                                }
                            />
                        </div>

                    </div>
                </div>

                <div className='info-panel-item-wrap' style={styles.itemWrap}>
                    <div className='item-container'>

                        <div className='item-header'>
                            <h5>COMMUNICATION</h5>
                        </div>

                        <div className='item-content flex-container'>
                            <div className='fixed-item text-center' style={styles.sideLabel}>
                                <TwoLineLabel 
                                    value={this.props.internetData ? this.props.internetData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.internetData ? this.props.internetData.fieldLabel : ''}
                                />
                            </div>
                            <div className='flexy-item' style={{height: '100%'}}>
                                <DonutChart 
                                    containerID={'communicationChartDiv'}
                                    containerWidth={'100%'}
                                    containerHeight={'180px'}
                                    fieldName={'fieldValue'}
                                    data={this.props.languageData}
                                />
                            </div>
                            <div className='fixed-item text-center' style={styles.sideLabel}>
                                <TwoLineLabel 
                                    // value={this.props.vehicleData ? this.props.vehicleData.fieldValue.toFixed(1) + '%' : ''}
                                    // label={this.props.vehicleData ? this.props.vehicleData.fieldLabel : ''}
                                />
                            </div>
                        </div>

                        <div className='item-footer'>
                            <HorizontalLegend 
                                data={
                                    this.props.languageData
                                    .map(d=>{ 
                                        const label = d.fieldLabel;
                                        const color = d.color;
                                        return { label, color };
                                    })
                                }
                            />
                        </div>

                    </div>
                </div>


            </div>
        );
    }
};

export default InfoPanel;