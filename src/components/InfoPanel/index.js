import './style.scss';

import React from 'react';

import PrecipChart from '../PrecipChart';
import WindChart from '../WindChart';
import DonutChart from '../DonutChart';
import TwoLineLabel from './TwoLineLabel';
import HorizontalLegend from '../HorizontalLegend';
import PercentBarChart from '../PercentBarChart';
import DotNavControl from '../DotNavControl';

import { numberFns } from 'helper-toolkit-ts';

class InfoPanel extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            activeChartIndex: 0
        };

        this.infoItemsContainerRef = React.createRef();
        this.precipChartContainerRef = React.createRef();

        this.infoPanelOnScroll = this.infoPanelOnScroll.bind(this);
        this.scrollHorizontally = this.scrollHorizontally.bind(this);
    };

    updateActiveChartIndex(index=0){
        this.setState({
            activeChartIndex: index
        });
    };

    scrollHorizontally(index=0){
        const container = this.infoItemsContainerRef.current;
        const leftPx = index * container.offsetWidth;
        container.scrollLeft = leftPx;
    }

    infoPanelOnScroll(){

        if(this.props.isMobile){
            const container = this.precipChartContainerRef.current;

            const boundingClientRect = container.getBoundingClientRect();

            const xPos = Math.abs(boundingClientRect.x);

            const breakPoints = [0, 300, 650, 1000];

            let activeChartIndex = 0;

            breakPoints.forEach((val,i)=>{
                const nextVal = breakPoints[i + 1] || Number.POSITIVE_INFINITY;
                if(xPos >= val && xPos < nextVal){
                    activeChartIndex = i;
                }
            });

            this.updateActiveChartIndex(activeChartIndex)
    
            // console.log('i am scrolling', activeChartIndex);
        }

    }

    render(){
        const isHide = !this.props.isVisible ? 'hide' : '';

        const styles = {
            itemWrap: { 
                // height: '220px', 
                width: '100%',
                marginBottom: this.props.isMobile ? '.5rem' : '2rem'
            },
            sideLabel: {width: '100px'}
        };

        const chartContainerHeight = this.props.isMobile ? '190px' : '180px';
        const donutChartContainerHeight = this.props.isMobile ? '165px' : '180px';

        // { this.props.isMobile && !this.props.locationName
        //     ?  <div className='alert-message-no-selected-community'>
        //         <span className='font-size--3'>For community awareness within the US about a hurricane in your area, click on the map or search below</span>
        //     </div> 
        //     :  null
        // }

        const alertMessage = (
            <div className='alert-message-no-selected-community trailer-half'>
                 {/* <span className='font-size--3'>For community awareness within the USA about a hurricane in your area, click on the map or <a className='link-light-blue' onClick={this.props.openDrawerMenuOnClick}>open the search above</a>.</span> */}
                 <span className='font-size-1'>Click on the map to view community information or <a className='link-light-blue' onClick={this.props.openDrawerMenuOnClick}>search above</a>.</span>
            </div> 
        );

        // indicate which chart is currently in view
        // also work as a cue so user know they can scroll horizontally
        const dotNavControl = this.props.isMobile 
        ? (
            <DotNavControl 
                data={[0,1,2,3]}
                activeIndex={this.state.activeChartIndex}
                onClick={this.scrollHorizontally}
            />
        ) 
        : null;

        const infoPanelComponent = (        
            <div id='infoPanelDiv' className={`${isHide} ${this.props.isMobile ? 'is-mobile' : ''}`}>

                { !this.props.isMobile ? <hr className='info-panel-divider'/> : null }

                <div className='location-info-dev text-center'>
                    <span className='avenir-light font-size--1'>Information for {this.props.locationName}</span>
                </div>

                <div className={`info-panel-items-container fancy-scrollbar`} ref={this.infoItemsContainerRef} onScroll={this.infoPanelOnScroll}>

                    <div className='info-panel-item-wrap' style={styles.itemWrap} ref={this.precipChartContainerRef} >

                        <div className='item-container'>
                            <div className='item-header'>
                                <h5 className='avenir-light font-size--1'>PRECIPITATION</h5>
                            </div>
                            <div className='item-content'>
                                <PrecipChart 
                                    containerID={'precipChartDiv'}
                                    containerWidth={'100%'}
                                    containerHeight={chartContainerHeight}
                                    fieldNameForXAxis={'fromdate'}
                                    fieldNameForYAxis={'value'}
                                    data={this.props.precipData}
                                    isMobile={this.props.isMobile}
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
                                    containerHeight={chartContainerHeight}
                                    fieldNameForXAxis={'fromdate'}
                                    fieldNameForYAxis={'force'}
                                    data={this.props.windGustData}
                                    isMobile={this.props.isMobile}
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
                                        containerHeight={donutChartContainerHeight}
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
                                    isMobile={this.props.isMobile}
                                />

                                <PercentBarChart 
                                    key={'PercentBarChart-2'} 
                                    labelOnLeft={this.props.mobilePhoneData ? 'Has Mobile Phone' : ''}
                                    labelOnRight={this.props.mobilePhoneData ? this.props.mobilePhoneData.fieldLabel : ''}
                                    value={this.props.mobilePhoneData? (100 - this.props.mobilePhoneData.fieldValue) : 0}
                                    isMobile={this.props.isMobile}
                                />

                                <PercentBarChart 
                                    key={'PercentBarChart-3'} 
                                    labelOnLeft={this.props.internetData ? 'Has Internet' : ''}
                                    labelOnRight={this.props.internetData ? this.props.internetData.fieldLabel : ''}
                                    value={this.props.internetData? (100 - this.props.internetData.fieldValue) : 0}
                                    isMobile={this.props.isMobile}
                                />

                            </div>

                        </div>
                    </div>

                </div>
                
                { dotNavControl }
            </div>
        );

        return this.props.isMobile && !this.props.locationName ? alertMessage : infoPanelComponent;
    }
};

export default InfoPanel;