import React from 'react';

import './style.scss';

class StormInfoWindowListItem extends React.Component {
    constructor(props){
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler(){
        console.log('storm list item on click', this.props.data);
    }

    render(){
        return (   
            <div className='storm-info-list-item' onClick={this.onClickHandler}>
                <div className='date-label'><span className='font-size--2'>{this.props.data.attributes.dateLabel}</span></div>
                <div className='category-icon' data-value={this.props.data.attributes.category}></div>
                <div className='storm-type text-right'><span className='font-size--3'>{this.props.data.attributes.stormType}</span></div>
            </div>
        );
    }
}

export default StormInfoWindowListItem;