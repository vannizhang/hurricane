import React from 'react';

import ListItem from './ListItem';

class StormInfoWindow extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){

        const listItems = this.props.data.map((d, i)=>{
            return <ListItem 
                key={`storm-info-list-item-${i}`} 
                data={d} 
                onClick={this.props.onClick} 
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
            />;
        });

        const isHide = !this.props.data.length ? 'hide' : '';

        return (            
            <div className={`leader-half ${isHide}`}>
                <h6>FORECASTED STORM INTENSITY</h6>
                {listItems}
            </div>
        )
    }
}

export default StormInfoWindow;