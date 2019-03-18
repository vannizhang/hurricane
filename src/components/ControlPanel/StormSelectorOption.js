import React from 'react';

class StormSelector extends React.Component {
    constructor(props){
        super(props);

        this.dropdownMenuOnClick = this.dropdownMenuOnClick.bind(this);
    }

    dropdownMenuOnClick(){
        this.props.onClick(this.props.data);
    }

    render(){
        return (            
            <span className="dropdown-link" role="menuitem" onClick={this.dropdownMenuOnClick}>
                {this.props.data.label}
            </span>
        )
    }
}

export default StormSelector;