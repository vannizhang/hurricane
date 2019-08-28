import './style.scss';
import React from 'react';

export default class DotNavControl extends React.PureComponent {

    constructor(props){
        super(props);

        // this.state = {
        //     activeIndex: 0
        // }
    }

    render(){

        const activeIndex = this.props.activeIndex || 0;

        const data = this.props.data || [];
        const dotNavControlItems = data.map((d,i)=>{
            const isActive = ( i === activeIndex ) ? 'is-active' : '';
            return <div key={`dot-nav-control-item-${i}`} className={`dot-nav-control-item ${isActive}`} data-item-index={i} onClick={this.props.onClick.bind(this, i)}></div>;
        });

        return (
            <div className='dot-nav-control'>
                {dotNavControlItems}
            </div>
        );
    }

}