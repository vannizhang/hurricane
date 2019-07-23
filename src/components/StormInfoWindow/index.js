import React from 'react';

import ListItem from './ListItem';
import ListViewForPhone from './ListViewForPhone';

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

    getStormInfoWindowForDesktop(){

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

        const unitSwitcher = this.getUnitSwitcher();

        return (
            <div className='phone-hide' data-view-type='desktop'>
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
        );
    }

    getStormInfoWindowForMobile(){
        return (
            <div className='phone-show' data-view-type='phone'>
                <ListViewForPhone 
                    data={this.props.data}
                    windSpeedUnit={this.state.windSpeedUnit}
                    onClick={this.props.onClick} 
                />
            </div>
        );
    }

    render(){

        const isHide = !this.props.data.length ? 'hide' : '';

        const stormListView = this.props.isMobile ? this.getStormInfoWindowForMobile() : this.getStormInfoWindowForDesktop();

        return (            
            <div className={`leader-half phone-leader-0 ${isHide}`}>
                {stormListView}
            </div>
        );
    }
}

export default StormInfoWindow;