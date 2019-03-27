'use strict';

import axios from 'axios';

const config = {
    layers: [
        {
            title: 'Language Sopken at Home',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Language_by_Age_Boundaries/FeatureServer/2',
            fields: [
                {
                    name: 'B16007_calc_pctEngOnlyE',
                    alias: 'Percent of Total Population Age 5+ Who Only Speaks English at Home',
                    label: 'Speak Only English'
                }
                // {
                //     name: 'B16007_calc_pctSpanE',
                //     alias: 'Percent of Total Population Age 5+ Who Speaks Spanish at Home',
                //     label: ''
                // }
            ]
        },
        {
            title: 'Internet Connectivity',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Internet_Connectivity_Boundaries/FeatureServer/2',
            fields: [
                {
                    name: 'B28002_calc_pctNoIntE',
                    alias: 'Percent of Households with No Internet Access',
                    label: 'No Internet Available'
                }
            ]
        },
        {
            title: 'Vehicle Avialability',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Vehicle_Availability_Boundaries/FeatureServer/2',
            fields: [
                {
                    name: 'B08201_calc_pctNoVehE',
                    alias: 'Percent of households with no vehicle available',
                    label: 'No Vehicle Available'
                }
            ]
        },
        {
            title: 'Disability Status',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Disability_by_Age_and_Sex_Boundaries/FeatureServer/2',
            fields: [
                {
                    name: 'B18101_calc_pctMDE',
                    alias: 'Percent of Male Population with a disability',
                    label: 'Has Disability'
                },
                {
                    name: 'B18101_calc_pctFDE',
                    alias: 'Percent of Female Population with a disability',
                    label: 'Has Disability'
                }
            ]
        },
        {
            title: 'Population',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Total_Population_Boundaries/FeatureServer/2',
            fields: [
                {
                    name: 'B01001_001E',
                    alias: 'Total Population',
                    label: ''
                },
                {
                    name: 'B01001_calc_numLT18E',
                    alias: 'Count of People Less Than 18 Years',
                    label: '< 18 yrs'
                },
                {
                    name: 'B01001_calc_numGE65E',
                    alias: 'Count of People 65 Years and Over',
                    label: '+ 65 yrs'
                }
            ]
        }
        // {
        //     title: '',
        //     url: '',
        //     fields: [
        //         {
        //             name: '',
        //             alias: ''
        //         }
        //     ]
        // }
    ]
};

export default function(){

    const queryByLocation = (mapPoint=null)=>{

        const promises = config.layers.map(d=>{

            const requestUrl = d.url + '/query';

            const params = {
                where: '1=1',
                outFields: d.fields.map(f=>f.name).join(','),
                geometry: mapPoint,
                geometryType: 'esriGeometryPoint',
                spatialRel: 'esriSpatialRelIntersects',
                returnGeometry: false,
                f: 'json'
            };

            return fetchData(requestUrl, params);
        });

        return new Promise((resolve, reject)=>{

            Promise.all(promises).then(results => { 
                // console.log('demographic data query result', beautifyQueryResults(results));
                resolve(beautifyQueryResults(results));
            }).catch(err=>{
                reject(err);
            });
        });
    };

    const beautifyQueryResults = (results)=>{
        
        const beautifiedData = {};

        config.layers.forEach((d,i)=>{

            const title = d.title;
            const fields = d.fields;
            const attributes = results[i] && results[i][0] && results[i][0].attributes ? results[i][0].attributes : null;

            const beautifiedAttributes = fields.map(d=>{
                const fieldName = d.name;
                const fieldAlias = d.alias;
                const fieldLabel = d.label;
                const fieldValue = attributes[fieldName];
                

                return {
                    fieldAlias,
                    fieldLabel,
                    fieldValue
                };
            });

            beautifiedData[title] = beautifiedAttributes;

        });

        if(beautifiedData['Language Sopken at Home']){

            const pctSpeakOtherLanguage = {
                fieldAlias: 'Percent of Total Population Age 5+ Who Speaks Other Languages at Home',
                fieldLabel: 'Other Languages',
                fieldValue: 100 - beautifiedData['Language Sopken at Home'][0].fieldValue
            };

            beautifiedData['Language Sopken at Home'].push(pctSpeakOtherLanguage);
        }

        if(beautifiedData['Population']){

            const countOfTotalPopu = beautifiedData['Population'][0]
            const countOfPeopleLessThan18 = beautifiedData['Population'][1];
            const countOfPeopleOver65 = beautifiedData['Population'][2];
            const nonDependentPopu = countOfTotalPopu.fieldValue - (countOfPeopleLessThan18.fieldValue + countOfPeopleOver65.fieldValue)

            const countPopu18to64= {
                fieldAlias: 'Count of People 18 to 64',
                fieldLabel: '18-64 yrs',
                fieldValue: nonDependentPopu
            };

            const rearrangedPopulationData = [
                countOfTotalPopu,
                countOfPeopleLessThan18,
                countPopu18to64,
                countOfPeopleOver65
            ]

            beautifiedData['Population'] = rearrangedPopulationData;
        }

        if(beautifiedData['Disability Status']){

            const pctHasDisability= {
                fieldAlias: 'Percent of Population with a disability',
                fieldLabel: 'Has Disability',
                fieldValue: beautifiedData['Disability Status'][0].fieldValue + beautifiedData['Disability Status'][1].fieldValue
            };

            beautifiedData['Disability Status'].push(pctHasDisability);
        }

        return beautifiedData;
    };

    const fetchData = (requestUrl, params)=>{

        return new Promise((resolve, reject)=>{

            axios.get(requestUrl, { params }).then((response)=>{
                // console.log(response);

                if(response.data && response.data.features){
                    resolve(response.data.features)
                } else {
                    reject('no features returned', response.data);
                }

            }).catch(err=>{
                // console.error(err);
                reject(err);
            });
        });

    };

    return {
        queryByLocation
    };

};