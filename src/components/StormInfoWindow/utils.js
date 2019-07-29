const parseForecastTime = (dateLabel='')=>{
    const dateLabelParts = dateLabel.split(' ');
    const hour = dateLabelParts[0] ? +dateLabelParts[0].split(":")[0] : '';
    const ampm = dateLabelParts[1] || '';
    const weekofDay = dateLabelParts[2] || '';

    return {
        hour,
        ampm,
        weekofDay
    }
};

export {
    parseForecastTime
};