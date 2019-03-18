import React from 'react';

import StormSelectorOptions from './StormSelectorOption';

const SELECTOR_BTN_LABEL_DEFAULT_STRING = 'SELECT STORM';

class StormSelector extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            selectorBtnLabel: SELECTOR_BTN_LABEL_DEFAULT_STRING
        };

        this.dropdownMenuOnClick = this.dropdownMenuOnClick.bind(this);
    }

    dropdownMenuOnClick(data){
        // console.log(val);
        this.props.onSelect(data.value);
        this.updateSelectorBtnLabel(data.label);
    }

    updateSelectorBtnLabel(label=SELECTOR_BTN_LABEL_DEFAULT_STRING){
        this.setState({
            selectorBtnLabel: label
        });
    }

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

    render(){
        const dropdownMenuOptions = this.getDropdownMenuOptions(this.props.data);
        return (            
            <div className="dropdown js-dropdown" style={{width: '100%'}}>
                <button className="btn btn-fill dropdown-btn js-dropdown-toggle" tabIndex="0" aria-haspopup="true" aria-expanded="false">
                    {this.state.selectorBtnLabel}
                </button>

                <nav className="dropdown-menu" role="menu" style={{width: '100%'}}>
                    {dropdownMenuOptions}
                </nav>
            </div>
        )
    }
}

export default StormSelector;