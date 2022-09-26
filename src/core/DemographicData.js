'use strict';

import axios from 'axios';
import colors from '../data/Colors';

const config = {
    layers: [
        {
            title: 'Language',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_English_Ability_and_Lingusitic_Isolation_Households_Boundaries/FeatureServer/2',
            urlCountyLevelData: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_English_Ability_and_Lingusitic_Isolation_Households_Boundaries/FeatureServer/1',
            fields: [
                {
                    name: 'B16003_calc_pctLEHE',
                    alias: 'Percent of population age 5 years and over in limited English households',
                    label: 'Limited English Ability'
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
            urlCountyLevelData: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Internet_Connectivity_Boundaries/FeatureServer/1',
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
            urlCountyLevelData: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Vehicle_Availability_Boundaries/FeatureServer/1',
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
            urlCountyLevelData: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Disability_by_Age_and_Sex_Boundaries/FeatureServer/1',
            fields: [
                {
                    name: 'B18101_calc_pctMDE',
                    alias: 'Percent of Male Population with a disability',
                    label: 'Has Disability Male'
                },
                {
                    name: 'B18101_calc_pctFDE',
                    alias: 'Percent of Female Population with a disability',
                    label: 'Has Disability Female'
                }
            ]
        },
        {
            title: 'Population',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Total_Population_Boundaries/FeatureServer/2',
            urlCountyLevelData: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Total_Population_Boundaries/FeatureServer/1',
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
        },
        {
            title: 'Mobile Phone Availability',
            url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Highlights_Emergency_Response_Boundaries/FeatureServer/2',
            urlCountyLevelData: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Highlights_Emergency_Response_Boundaries/FeatureServer/1',
            fields: [
                {
                    name: 'B28001_calc_pctNoSPE',
                    alias: 'No Mobile Phone',
                    label: 'No Mobile Phone'
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

    const queryByLocation = (mapPoint=null, shouldFetchCountyLevelData=false)=>{

        const promises = config.layers.map(d=>{

            const requestUrl = shouldFetchCountyLevelData 
                ? d.urlCountyLevelData + '/query'    
                : d.url + '/query';

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
                const fieldValue = typeof +attributes[fieldName] !== 'number' ? 0 : +attributes[fieldName];
                const color = colors[fieldLabel]

                return {
                    fieldAlias,
                    fieldLabel,
                    fieldValue,
                    color
                };
            });

            beautifiedData[title] = beautifiedAttributes;

        });

        if(beautifiedData['Language']){

            const pctSpeakEnglish = {
                fieldAlias: 'Percent of Total Population Age 5+ Who Speaks English very well',
                fieldLabel: 'Speaks English',
                fieldValue: 100 - beautifiedData['Language'][0].fieldValue,
                color: colors['Other Languages']
            };

            beautifiedData['Language'].unshift(pctSpeakEnglish);
        }

        if(beautifiedData['Population']){

            const countOfTotalPopu = beautifiedData['Population'][0]
            const countOfPeopleLessThan18 = beautifiedData['Population'][1];
            const countOfPeopleOver65 = beautifiedData['Population'][2];
            const nonDependentPopu = countOfTotalPopu.fieldValue - (countOfPeopleLessThan18.fieldValue + countOfPeopleOver65.fieldValue)

            const countPopu18to64= {
                fieldAlias: 'Count of People 18 to 64',
                fieldLabel: '18-64 yrs',
                fieldValue: nonDependentPopu,
                color: colors['18-64 yrs']
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
                fieldValue: (beautifiedData['Disability Status'][0].fieldValue + beautifiedData['Disability Status'][1].fieldValue) / 2
            };

            beautifiedData['Disability Status'].push(pctHasDisability);
        }

        if(beautifiedData['Mobile Phone Availability']){

            const pctHasMobilePhone= {
                fieldAlias: 'Percent of Household has no Mobile Phone',
                fieldLabel: 'No Samrtphone',
                fieldValue: (beautifiedData['Mobile Phone Availability'][0].fieldValue)
            };

            beautifiedData['Mobile Phone Availability'].push(pctHasMobilePhone);
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