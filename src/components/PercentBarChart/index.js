import './style.scss';

import React from 'react';
import colors from '../../data/Colors';

export default class PercentBarChart extends React.PureComponent {

    constructor(props){
        super(props);
    }

    render(){

        const labelOnLeft = this.props.labelOnLeft || '';
        const labelOnRight = this.props.labelOnRight || '';
        const value = this.props.value || 0;
        const backgroundColor = this.props.backgroundColor || null;
        const highlightColor = this.highlightColor || null;

        const pctBarValueText = value ? <span className='pct-bar-value-text font-size--2'>{value.toFixed(1)}%</span> : null;

        return(
            <div className='pct-bar-chart-container trailer-1'>
                <div className='pct-bar-labels' style={{color: colors.chartLabelText}}>
                    <div className='pct-bar-label text-ellipsis'>
                        <span className='avenir-light font-size--2'>{labelOnLeft}</span>
                    </div>
                    <div className='pct-bar-label text-ellipsis text-right'>
                        <span className='avenir-light font-size--2'>{labelOnRight}</span>
                    </div>
                </div>
                <div className='pct-bar-wrap leader-quarter'>
                    <div className='pct-bar-element text-center padding-leader-quarter padding-trailer-quarter' style={{width: value + '%'}}>
                        {pctBarValueText}
                    </div>
                </div>
            </div>
        )
    }

};