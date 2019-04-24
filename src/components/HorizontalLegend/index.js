import './style.scss';

import React from 'react';


export default class HorizonatlLegend extends React.PureComponent {

    constructor(props){
        super(props);
    }

    getLegendItem(label='', color='rgba(0,0,0,0)', index=-1){
        return (
            <div className='legend-item' key={`legend-item-${index}`}>
                <span className='legend-icon margin-right-half' style={{backgroundColor: color}}></span>
                <span className='legend-label'>{label}</span>
            </div>
        );
    }

    render(){
        
        const legendItems = this.props.data.map((d, i)=>{
            return this.getLegendItem(d.label, d.color, i);
        });
        
        return(
            <div className='horizontal-legend'>
                {legendItems}
            </div>
        )
    }
};