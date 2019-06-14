import './StormSelector.scss';
import React from 'react';
import StormSelectorOptions from './StormSelectorOption';

const SELECTOR_BTN_LABEL_DEFAULT_STRING = 'SELECT STORM';

class StormSelector extends React.PureComponent {
    constructor(props){
        super(props);

        // this.state = {
        //     selectorBtnLabel: SELECTOR_BTN_LABEL_DEFAULT_STRING
        // };

        this.dropdownMenuOnClick = this.dropdownMenuOnClick.bind(this);
    }

    dropdownMenuOnClick(data){
        // console.log(val);
        this.props.onSelect(data.value);
        // this.updateSelectorBtnLabel(data.label);
    }

    // updateSelectorBtnLabel(label=SELECTOR_BTN_LABEL_DEFAULT_STRING){
    //     this.setState({
    //         selectorBtnLabel: label
    //     });
    // }

    getDropdownMenuOptions(data=[]){
        return data.map((d, i)=>{
            return (
                <StormSelectorOptions 
                    key={`StormSelectorOptions-${i}`}
                    data={d}
                    onClick={this.dropdownMenuOnClick}
                />
            );
        })
    }

    getBtnLabel(){
        if(this.props.activeStorm){
            
            const activeStormData = this.props.data.filter(d=>{
                return d.value === this.props.activeStorm
            })[0];

            return activeStormData ? activeStormData.label : SELECTOR_BTN_LABEL_DEFAULT_STRING;
            
        } else {
            return SELECTOR_BTN_LABEL_DEFAULT_STRING;
        }
    }

    render(){
        console.log(this.props);

        const dropdownMenuOptions = this.getDropdownMenuOptions(this.props.data);
        return (            
            <div className="dropdown js-dropdown trailer-half storm-selector" style={{width: '100%'}}>
                <button className="btn btn-fill dropdown-btn js-dropdown-toggle" tabIndex="0" aria-haspopup="true" aria-expanded="false" style={{background: '#77bde7', color: '#00304d'}}>
                    <span className='avenir-light font-size-0'>{this.getBtnLabel()}</span>
                </button>

                <nav className="dropdown-menu" role="menu" style={{width: '100%'}}>
                    {dropdownMenuOptions}
                </nav>
            </div>
        )
    }
}

export default StormSelector;