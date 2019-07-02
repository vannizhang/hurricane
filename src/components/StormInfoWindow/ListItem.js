import React from 'react';

import './style.scss';

class StormInfoWindowListItem extends React.PureComponent {
    constructor(props){
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    }

    onClickHandler(){
        // console.log('storm list item on click', this.props.data);
        this.props.onClick(this.props.data);
    }

    onMouseEnterHandler(){
        this.props.onMouseEnter(this.props.data);
    }

    render(){
        const dateLabelParts = this.props.data.attributes.dateLabel.split(' ');

        return (   
            <div className='storm-info-list-item' onClick={this.onClickHandler} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.props.onMouseLeave}>

                <div className='time-info-div'>
                    <span className='font-size--3'>{`${dateLabelParts[0]} ${dateLabelParts[1]}`}</span>
                    <br></br>
                    <span className='font-size--3'>{`${dateLabelParts[2]} ${dateLabelParts[3]}`}</span>
                </div>

                <div className='storm-info-div padding-left-1 padding-leader-quarter padding-trailer-quarter'>

                    <div className='storm-info-header'>
                        <div className='storm-category-name'>
                            <span className='font-size--1 avenir-light'>{this.props.data.attributes.localizedName}</span>
                        </div>
                        <div className='category-icon' data-value={this.props.data.attributes.category}></div>
                    </div>

                    <div className='storm-info-additional font-size--3'>
                        <div>
                            <span className='info-type'>Maximum Wind Speed:</span>
                            <span className='info-value'>{this.props.data.attributes.maxWind} MPH</span>
                        </div>
                        {/* <div>
                            <span className='info-type'>gusting:</span>
                            <span className='info-value'>{this.props.data.attributes.gust} MPH</span>
                        </div> */}
                    </div>
                    
                </div>
            </div>

        );
    }
}

export default StormInfoWindowListItem;