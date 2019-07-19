import React from 'react';

import './stylePhoneView.scss';

class StormInfoWindowListViewPhone extends React.PureComponent {
    constructor(props){
        super(props);

        this.state = {
            activeItemIndex: 0
        }

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    
    onClickHandler(){
        // console.log('storm list item on click', this.props.data);
        // this.props.onClick(this.props.data);
    }

    getListItems(){
        return this.props.data.map((d,i)=>{

            const dateLabelParts = d.attributes.dateLabel.split(' ');
            const hour = dateLabelParts[0].split(":")[0];
            const ampm = dateLabelParts[1];
            const weekofDay = dateLabelParts[2];
            const timezone = d.attributes.timezone;
    
            // const maxWind = this.props.windSpeedUnit === 'mph' ? (d.attributes.maxWind * 1.151).toFixed(0) : (d.attributes.maxWind * 1.852).toFixed(0);

            const isActive = i === this.state.activeItemIndex ? 'is-active' : '';
    
            return (   
                <div key={`storm-info-list-item-phone-${i}`} className={`storm-info-list-item-phone ${isActive}`} onClick={this.onClickHandler}>
    
                    <div className='storm-info-div trailer-quarter'>
                        <div className='category-icon' data-value={d.attributes.category}></div>
                    </div>

                    <div className='time-info-div font-size--3 avenir-light text-center'>
                        <span className=''>{`${hour} ${ampm} ${timezone}`}</span>
                        <br></br>
                        <span className=''>{`${weekofDay}`}</span>
                    </div>
    

                </div>
    
            );
        });
    }

    render(){
        const listItems = this.getListItems();

        const activeItem = this.props.data[this.state.activeItemIndex];
        const stormCategory = activeItem ? activeItem.attributes.localizedName : '';
        const maxWind = activeItem 
        ? (
            this.props.windSpeedUnit === 'mph' 
            ? (activeItem.attributes.maxWind * 1.151).toFixed(0) 
            : (activeItem.attributes.maxWind * 1.852).toFixed(0)
        )
        : '';
        const headerText = `${stormCategory} (${maxWind}${this.props.windSpeedUnit})`;

        const listViewHeader = activeItem 
            ? (
                <div className='font-size--2 trailer-half'>
                    <span>{headerText}</span>
                </div>
            ) 
            : null;

        return (
            <div className='storm-info-list-view-wrap-phone'>
                {listViewHeader}
                <div className='storm-info-list-view-phone'>
                    {listItems}
                </div>
            </div>

        );
    }
};

export default StormInfoWindowListViewPhone;
