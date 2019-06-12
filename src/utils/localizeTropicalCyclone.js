const getLocalizedTropicalCycloneClassifications = (maxWind=0, basin='')=>{
        
    if(!maxWind || !basin){
        return 'NO DATA'
    }

    if(basin.match(/al|cp|EP|NA|SA|SL|CS|GM/gi)){
        return getNHCclassifications(maxWind);
    } 
    else if (basin.match(/WP/gi)) {
        return getJTWCclassifications(maxWind);
    }
    else if (basin.match(/SH|SP|WA|EA/gi)) {
        return getAustraliaclassifications(maxWind);
    }
    else if (basin.match(/IO|NI|AS|BB/gi)) {
        // BASIN == "IO" || BASIN == "NI" || BASIN == "AS" || BASIN == "BB"
        return getNIndianClassifications(maxWind);
    }
    else if (basin.match(/SI/gi)){
        return getSWIndianClassifications();
    }
    else {
        return 'NO DATA';
    }

}

// NE Pacific & N Atlantic
// BASIN == "al" || BASIN =="cp" || BASIN == "EP" || BASIN == "ep" || BASIN == "NA" || BASIN == "SA" || BASIN == "SL" || BASIN == "CS" || BASIN =="GM"
const getNHCclassifications = (maxWind=0)=>{

    let category = '';

    switch(true){
        case (maxWind <= 33):
            category = 'Tropical Depression';
            break;
        case (maxWind > 33 && maxWind <= 63):
            category = 'Tropical Storm';
            break;
        case (maxWind > 63 && maxWind <= 82):
            category = 'Category 1 Hurricane';
            break;
        case (maxWind > 82 && maxWind <= 95):
            category = 'Category 2 Hurricane';
            break;
        case (maxWind > 95 && maxWind <= 112):
            category = 'Category 3 Hurricane';
            break;
        case (maxWind > 112 && maxWind <= 136):
            category = 'Category 4 Hurricane';
            break;
        case (maxWind > 136):
            category = 'Category 5 Hurricane';
            break;
        default:
            category = 'NO DATA'
            break;
    }

    return category;
};

// NW Pacific
// BASIN == "WP"
const getJTWCclassifications = (maxWind=0)=>{

    let category = '';

    switch(true){
        case (maxWind <= 33):
            category = 'Tropical Depression';
            break;
        case (maxWind > 33 && maxWind <= 63):
            category = 'Tropical Storm';
            break;
        case (maxWind > 63 && maxWind <= 129):
            category = 'Typhoon';
            break;
        case (maxWind > 129):
            category = 'Super Typhoon';
            break;
        default:
            category = 'NO DATA'
            break;
    }

    return category;
}

// Australia & S Pacific
// BASIN == "SH" || BASIN == "SP" || BASIN == "WA" || BASIN == "EA"
const getAustraliaclassifications = (maxWind=0)=>{

    let category = '';

    switch(true){
        case (maxWind < 34):
            category = 'Tropical Disturbance/Depression/Low';
            break;
        case (maxWind >= 34 && maxWind <= 47):
            category = 'Category 1 Tropical Cyclone';
            break;
        case (maxWind >= 48 && maxWind <= 63):
            category = 'Category 2 Tropical Cyclone';
            break;
        case (maxWind >= 64 && maxWind <= 85):
            category = 'Category 3 Tropical Cyclone';
            break;
        case (maxWind >= 86 && maxWind <= 107):
            category = 'Category 4 Tropical Cyclone';
            break;
        case (maxWind >= 108):
            category = 'Category 5 Tropical Cyclone';
            break;
        default:
            category = 'NO DATA'
            break;
    }

    return category;
};

// N Indian Ocean
// BASIN == "IO" || BASIN == "NI" || BASIN == "AS" || BASIN == "BB"
const getNIndianClassifications = (maxWind=0)=>{

    let category = '';

    switch(true){
        case (maxWind < 17):
            category = 'Low Pressure Area';
            break;
        case (maxWind >= 17 && maxWind <= 27):
            category = 'Depression';
            break;
        case (maxWind >= 28 && maxWind <= 33):
            category = 'Deep Depression';
            break;
        case (maxWind >= 34 && maxWind <= 47):
            category = 'Cyclonic Storm';
            break;
        case (maxWind >= 48 && maxWind <= 63):
            category = 'Severe Cyclonic Storm';
            break;
        case (maxWind >= 64 && maxWind <= 89):
            category = 'Very Severe Cyclonic Storm';
            break;
        case (maxWind >= 90 && maxWind <= 120):
            category = 'Extremely Severe Cyclonic Storm';
            break;
        case (maxWind > 120):
            category = 'Super Cyclonic Storm';
            break;
        default:
            category = 'NO DATA'
            break;
    }

    return category;
};

// S Indian Ocean
// BASIN == "SI"
const getSWIndianClassifications = (maxWind=0)=>{

    let category = '';

    switch(true){
        case (maxWind < 28):
            category = 'Zone of Disturbed Weather';
            break;
        case (maxWind >= 28 && maxWind <= 29):
            category = 'Tropical Disturbance';
            break;
        case (maxWind >= 30 && maxWind <= 33):
            category = 'Tropical Depression';
            break;
        case (maxWind >= 34 && maxWind <= 47):
            category = 'Moderate Tropical Storm';
            break;
        case (maxWind >= 48 && maxWind <= 63):
            category = 'Severe Tropical Storm';
            break;
        case (maxWind >= 64 && maxWind <= 85):
            category = 'Tropical Cyclone';
            break;
        case (maxWind >= 86 && maxWind <= 113):
            category = 'Intense Tropical Cyclone';
            break;
        case (maxWind > 113):
            category = 'Very Intense Tropical Cyclone';
            break;
        default:
            category = 'NO DATA'
            break;
    }

    return category;
};

export {
    getLocalizedTropicalCycloneClassifications
}



