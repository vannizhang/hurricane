import React from 'react';

import ListItem from './ListItem';

class StormInfoWindow extends React.Component {
    constructor(props){
        super(props);
    }

    render(){

        const listItems = this.props.data.map((d, i)=>{
            return <ListItem key={`storm-info-list-item-${i}`} data={d} />
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