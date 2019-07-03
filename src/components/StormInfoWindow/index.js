import React from 'react';

import ListItem from './ListItem';

class StormInfoWindow extends React.PureComponent {
    constructor(props){
        super(props);

        this.state = {
            // valide unites for wind speed: mph | km/h
            windSpeedUnit: 'mph' 
        };

        this.toggleWindSpeedUnit = this.toggleWindSpeedUnit.bind(this);
    }

    toggleWindSpeedUnit(){
        const newUnit = this.state.windSpeedUnit === 'mph' ? 'km/h' : 'mph';
        this.setState({
            windSpeedUnit: newUnit
        });
    }

    getUnitSwitcher(){
        const unites = ['mph', 'km/h'];

        const crumbs = unites.map((d,i)=>{
            const isActiveClass = d === this.state.windSpeedUnit ? 'is-active' : ''
            return (
                <span key={`unit-switcher-crumb-${i}`} className={`crumb ${isActiveClass}`} onClick={this.toggleWindSpeedUnit}>{d}</span>
            )
        });

        return (
            <nav className="breadcrumbs">
                {crumbs}
            </nav>
        )
    }

    render(){

        const listItems = this.props.data.map((d, i)=>{
            return <ListItem 
                key={`storm-info-list-item-${i}`} 
                data={d} 
                onClick={this.props.onClick} 
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                windSpeedUnit={this.state.windSpeedUnit}
            />;
        });

        const isHide = !this.props.data.length ? 'hide' : '';

        const unitSwitcher = this.getUnitSwitcher();

        return (            
            <div className={`leader-half ${isHide}`}>
                <div className='storm-info-header trailer-half'>
                    <div className='is-flexy'>
                        <span className='font-size--1 avenir-light'>FORECASTED STORM INTENSITY</span>
                    </div>

                    <div className=''>
                        {unitSwitcher}
                    </div>
                </div>

                {listItems}
            </div>
        )
    }
}

export default StormInfoWindow;