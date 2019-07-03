import './style.scss';

import React from 'react';

import PrecipChart from '../PrecipChart';
import WindChart from '../WindChart';
import DonutChart from '../DonutChart';
import TwoLineLabel from './TwoLineLabel';
import HorizontalLegend from '../HorizontalLegend';
import PercentBarChart from '../PercentBarChart';

import { numberFns } from 'helper-toolkit-ts';

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

                <hr className='info-panel-divider'/>

                <div className='info-panel-item-wrap' style={styles.itemWrap}>

                    <div className='location-info-dev trailer-1 leader-1 text-center'>
                        <span className='avenir-light font-size--0'>Information for {this.props.locationName}</span>
                    </div>

                    <div className='item-container'>
                        <div className='item-header'>
                            <h5 className='avenir-light font-size--1'>PRECIPITATION</h5>
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
                            <h5 className='avenir-light font-size--1'>WIND GUST</h5>
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
                            <h5 className='avenir-light font-size--1'>POPULATION</h5>
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
                                    centerTextDefaultValue={this.props.populationData[0] ? numberFns.numberWithCommas(this.props.populationData[0].fieldValue) : ''}
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
                            <h5 className='avenir-light font-size--1'>COMMUNICATION</h5>
                        </div>

                        <div className='item-content'>

                            <PercentBarChart 
                                key={'PercentBarChart-1'} 
                                labelOnLeft={this.props.languageData[0] ? this.props.languageData[0].fieldLabel : ''}
                                labelOnRight={this.props.languageData[1] ? this.props.languageData[1].fieldLabel : ''}
                                value={this.props.languageData[0] ? this.props.languageData[0].fieldValue : 0}
                            />

                            <PercentBarChart 
                                key={'PercentBarChart-2'} 
                                labelOnLeft={this.props.mobilePhoneData ? 'Has mobile phone' : ''}
                                labelOnRight={this.props.mobilePhoneData ? this.props.mobilePhoneData.fieldLabel : ''}
                                value={this.props.mobilePhoneData? (100 - this.props.mobilePhoneData.fieldValue) : 0}
                            />

                            <PercentBarChart 
                                key={'PercentBarChart-3'} 
                                labelOnLeft={this.props.internetData ? 'Has internet' : ''}
                                labelOnRight={this.props.internetData ? this.props.internetData.fieldLabel : ''}
                                value={this.props.internetData? (100 - this.props.internetData.fieldValue) : 0}
                            />

                        </div>

                        {/* <div className='item-content flex-container'>
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
                                    value={this.props.mobilePhoneData ? this.props.mobilePhoneData.fieldValue.toFixed(1) + '%' : ''}
                                    label={this.props.mobilePhoneData ? this.props.mobilePhoneData.fieldLabel : ''}
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
                        </div> */}

                    </div>
                </div>


            </div>
        );
    }
};

export default InfoPanel;