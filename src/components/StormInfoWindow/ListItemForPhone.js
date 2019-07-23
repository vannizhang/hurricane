import React from 'react';

export default class ListItemForPhone extends React.PureComponent {
    constructor(props){
        super(props);

        this.onClickHandler =  this.onClickHandler.bind(this);
    }

    onClickHandler(){
        this.props.onClick({
            data: this.props.data,
            index: this.props.itemIndex
        });
    }

    render(){

        const d = this.props.data;
        const isActive = this.props.isActive;

        const dateLabelParts = d.attributes.dateLabel.split(' ');
        const hour = dateLabelParts[0].split(":")[0];
        const ampm = dateLabelParts[1];
        const weekofDay = dateLabelParts[2];
        const timezone = d.attributes.timezone;

        // const maxWind = this.props.windSpeedUnit === 'mph' ? (d.attributes.maxWind * 1.151).toFixed(0) : (d.attributes.maxWind * 1.852).toFixed(0);

        return (   
            <div className={`storm-info-list-item-phone ${isActive}`} onClick={this.onClickHandler}>

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
    }
}