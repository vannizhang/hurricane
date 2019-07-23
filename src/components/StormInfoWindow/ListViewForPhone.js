import React from 'react';

import './stylePhoneView.scss';
import ListItemForPhone from './ListItemForPhone';

class StormInfoWindowListViewPhone extends React.PureComponent {
    constructor(props){
        super(props);

        this.state = {
            activeItemIndex: 0
        }

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    
    onClickHandler(res={
        data: null,
        index: 0
    }){
        // console.log('storm list item on click', res);

        this.setActiveItemIndex(res.index);

        this.props.onClick(res.data);
    }

    setActiveItemIndex(index=0){
        this.setState({
            activeItemIndex: index
        });
    }

    getListItems(){
        return this.props.data.map((d,i)=>{

            const isActive = i === this.state.activeItemIndex ? 'is-active' : '';
    
            return <ListItemForPhone 
                key= {`list-item-for-phone-${i}`}
                isActive = {isActive}
                data = {d}
                onClick = {this.onClickHandler}
                itemIndex={i}
            />
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
                <div className='font-size--1 trailer-half padding-left-half padding-right-half'>
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
