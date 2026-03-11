import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {environment} from '../../../environments/environment'

export interface millsType{
    'value': String, 
    'viewValue': String,
}
export interface gradeType{
    'value': String, 
    'viewValue': String,
}
export interface plantType{
    'value': String, 
    'viewValue': String,
}

export interface modelType{
    'value': String, 
    'viewValue': String,
}

export interface adjustmentType{
    'Iot_Tag_Id': String, 
    'isChecked':boolean,
    'Generic_Description': String,
}

export interface blainsUrlType{
    'updateActualBlaineOneHour': string
    'updateRecommadationForBlaine':string,
    'updateRemarksForBlaine':string,
    'getLatestFilteredData':string,
    'getLastTwoHrsData':string,
    'getBarChartData':string
}

export const blainsUrlType={
    'updateActualBlaineOneHour': environment.baseUrl+ 'updateActualBlaineOneHour',
    'updateRecommadationForBlaine':environment.baseUrl+'updateRecommadationForBlaine',
    'updateRemarksForBlaine':environment.baseUrl+'updateRemarksForBlaine',
    'getLatestFilteredData':environment.baseUrl+'getLatestFilteredData',
    'getLastTwoHrsData':environment.baseUrl+'getLastTwoHrsData',
    'getBarChartData':environment.baseUrl+'getBarChartData',
    'exportCSVUrl':environment.baseUrl+'exportBlaineData',
    'getAdjustmentData': environment.baseUrl+'getControllableParameters',
    'getDropDownData':environment.baseUrl+'getDropDownFilter',
    'getBlainePredictionChartDataForActualBlaine':environment.baseUrl+'getBlainePredictionChartDataForActualBlaine',
    'getPredictionDataWithDatetime':environment.baseUrl+'getPredictionDataWithDatetime',
    'getBlaineAccMTD':environment.baseUrl+'getBlaineAccMTD',
    'getBlaineAccDaywiseMTD':environment.baseUrl+'getBlaineAccDaywiseMTD'
  }

  export const blainsUrl={
    // "addLog":'https://i4.utclconnect.com/api/addLog'
    "addLog":`${environment.baseUrlApi}addLog`
    // "addLog":'https://0207pwadeh.execute-api.ap-south-1.amazonaws.com/uat/addLog'
  }

export interface flagsType{
    showChart:Boolean,
    showNoData:Boolean,
    showLoader:Boolean,
    showData:Boolean

}

@Injectable({
    providedIn: 'root'
})

export class blainModel {
    // token:string|null;
    constructor(private http:HttpClient){
        // this.token=sessionStorage.getItem('accessToken')
    }

    /**@method @returns object @description flags states on page load */

    public getIntialFlagStats(){
        return {showChart:false,showNoData:false,showLoader:true,showData:false}
    }

   /**@method @returns object @description flags states after success  */
    
    public getFlagsStatusAfterSucess(){
        return {showChart:true,showNoData:false,showLoader:false,showData:true}
    } 

    /**@method @returns object @description flags states after faiure   */

    public getFlagsStatusAfterFailure(){
        return {showChart:false,showNoData:true,showLoader:false,showData:false}
    } 
   
    /**@method  @returns array of object @typedef millsType  @description for mills dropdown filter */

    public getMilllsData(){
        return [
            {value: 'U1CMML2', viewValue: 'U1CMML2'},
            {value: 'U1CMML3', viewValue: 'U1CMML3'},
        
          ];
    }

     /**@method  @returns array of object @typedef gradeType  @description for grade dropdown filter */

    public getGradeData(){
        return [
            {value: 'OPC53', viewValue: 'OPC53'},
            {value: 'OPC43', viewValue: 'OPC43'},
            {value: 'PPC', viewValue: 'PPC'},
        ];
    }


    /**@method  @description used for map adjustment checkbox states according to api response  @returns array of object*/

    public  mapAdjustmentWithData(dataSource:any,adjustmantData:any){
        if(dataSource &&dataSource.Tags_Data.length>0 ){
            dataSource.Tags_Data.forEach((item:any)=>{
                adjustmantData.forEach((data:any)=>{
                    if(item.Generic_Description==data.Generic_Description){
                        if(item.Remarks=='true'){
                        data.isChecked=true;
                        }
                    }
                })
            })
        }
        
         return adjustmantData;
    }


    /**@method   @returns array of object @description adjustemnt section data*/

    public getAdjustmentData(){
        return [
            {value:0, isChecked:false,viewValue:"Actual Feed (t/h)"},
            {value:1, isChecked:false,viewValue:"Bag House Fan Speed (rpm)"},
            {value:2, isChecked:false,viewValue:"Ball Mill Sepol Separator Fan Speed (rpm)"},
            {value:3, isChecked:false,viewValue:"Classifier/Separator Speed (rpm)"},
            {value:4, isChecked:false,viewValue:"Grinding Pressure (bar)"},
            {value:5, isChecked:false,viewValue:"Roller Press Fix Drive-1 Pressure (bar)"},
            {value:6, isChecked:false,viewValue:`Roller Press Movable Drive-2  Pressure (bar)`},
            {value:7, isChecked:false,viewValue:"Roller Press V-Separator Fan Speed (rpm)"}
          ]
    }

    /** @method which @returns array of numbers @description contain data for hours data for last 2 hours table */
    public generateArray(){
        var d = new Date();
        return [...Array(d.getHours()+1).keys()]
    }

    /** @method which @returns Observable @description used for api call  */

    public postCall(apiUrl:string, payload:any, token:any){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          });
        const httpOptions = {
            headers: headers
        };
        // return this.http.post(apiUrl,payload)
        return this.http.post(apiUrl,payload,httpOptions)
    }

   /**@method  @returns array of object  @typedef plantType @description for plant dropdown filter */

    public getPlantData(responseData:any, allPlants:any){
        var plantData:{ value: any; viewValue: any; }[]=[];
        var plantUniqueId:String[]=[];
        responseData.map((data:any)=>{
            plantData.push({value: data.plant_code, viewValue:data.Generic_plant_code})
        })

        // console.log(plantData);
        

        
        // modelData=modelData.filter((item)=>{
        //     const isDuplicated= modelUniqueId.includes(item.value)
        //     if(!isDuplicated){
        //         modelUniqueId.push(item.value); 
        //         return true 
        //     }
        //     else{
        //         return false;
        //     }
           
        // })
        plantData=plantData.filter((item)=>{
            const isDuplicated= plantUniqueId.includes(item.value)
            if(!isDuplicated){
                plantUniqueId.push(item.value); 
                return true 
            }
            else{
                return false;
            }
           
        })

        // console.log(plantData, allPlants)
        plantData= plantData.filter(obj1=>allPlants.some((obj2:any)=>obj1.viewValue==obj2.Plant))
        // console.log(plantData);
        

        return {plantData:plantData}
    }

    getMillsBasesPlant(plant:any, data:any){
        // console.log(plant)
        var millsData: { value: any; viewValue: any; }[]=[];
        var millsUniqueId: String[]=[];
        data.map((item:any)=>{
            if(item.plant_code==plant){
                millsData.push({value: item.Mill_No, viewValue: item.Mill_No})
            }
        })

        millsData=millsData.filter((item)=>{
            const isDuplicated= millsUniqueId.includes(item.value)
            if(!isDuplicated){
                millsUniqueId.push(item.value); 
                return true 
            }
            else{
                return false;
            }
           
        }) 
        return millsData
    }

    getGradeBasesPlantMills(plant:any, mill:any, data:any){
        var gradeData:{ value: any; viewValue: any; }[]=[];
        var gradeUniqueId: String[]=[];

        data.map((item:any)=>{
            if(item.plant_code==plant && item.Mill_No==mill){
                gradeData.push({value: item.Grade, viewValue: item.Grade})
            }
        })

        gradeData=gradeData.filter((item)=>{
            const isDuplicated= gradeUniqueId.includes(item.value)
            if(!isDuplicated){
                gradeUniqueId.push(item.value); 
                return true 
            }
            else{
                return false;
            }
           
        }) 
        return gradeData;
    }

    getModelBasedOnGrade(grade:any, plant:any, mill:any,data:any){
        var modelData:{ value: any; viewValue: any; }[]=[];
        var modelUniqueId:String[]=[];
        data.map((item:any)=>{
            if(item.Grade==grade && item.plant_code==plant && item.Mill_No==mill){
                modelData.push({value: item.Model_no, viewValue: "M-"+item.Model_no})
            }
        })

        modelData=modelData.filter((item)=>{
            const isDuplicated= modelUniqueId.includes(item.value)
            if(!isDuplicated){
                modelUniqueId.push(item.value); 
                return true 
            }
            else{
                return false;
            }
           
        }) 
       return modelData
    }



}