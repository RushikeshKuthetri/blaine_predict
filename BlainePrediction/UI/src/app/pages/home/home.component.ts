import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { environment } from '../../../environments/environment'
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

import { SocketService } from '../../services/socket.service';

import { blainModel, millsType, adjustmentType, gradeType, plantType, modelType, blainsUrlType, flagsType,blainsUrl } from './blainModel.model'
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

import { ModalService } from '../../services/modal.service'
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import 'moment-timezone';
import { local } from 'd3';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild("outlet", { read: ViewContainerRef })
  outletRef!: ViewContainerRef;
  @ViewChild("content", { read: TemplateRef }) contentRef!: TemplateRef<any>;
  private readonly _destroying$ = new Subject<void>();
  /** @variable @typeof of object @description store url for api calls */

  // blaineUrls:blainsUrlType={
  //   'updateActualBlaineOneHour': environment.baseUrl+ 'updateActualBlaineOneHour',
  //   'updateRecommadationForBlaine':environment.baseUrl+'updateRecommadationForBlaine',
  //   'updateRemarksForBlaine':environment.baseUrl+'updateRemarksForBlaine',
  //   'getLatestFilteredData':environment.baseUrl+'getLatestFilteredData',
  //   'getLastTwoHrsData':environment.baseUrl+'getLastTwoHrsData',
  //   'getBarChartData':environment.baseUrl+'getBarChartData',
  //   ''
  // }

  /** @variable @typeof Number @description to store value of actual blain input by user */
  public userActualBlaine!: Number;

  /**@variable @typeof String @description to store value of username */
  public username!: string | null;


  /**@variable @typeof  array of object  @description for store milles data, grade date, plant data for respectative dropdown filters  */
  public millsData!: millsType[];
  public gradeData!: gradeType[];
  public plantData!: plantType[];
  public modelData: modelType[] = [];


  /**@variable @typeof array of object @description store adjustment control checkbox data */
  public adjustmentItems!: adjustmentType[];
  public adjustmentArray:any=[];



  /**@variable @typeof number array and string @description store  hours dropdown data and store dropdown input  in last 2 hour blain table respectively  */
  hoursData!: Number[];
  blainHour!: Number;


  flags!: flagsType;
  datasource: any = {
    'Predicted_Blaine': 0
  };
  isRecommendation: any = null;
  imagePath: any;

  payloadData = {
    action: "blainOpt",
    Mill: 'null',
    Grade: 'null',
    Plant_Code: 'null',
    date: '',
    time: '',
    Model_No: 0
  }

  private intervalId: any;

  tableData: any;
  dropdownData: any;
  baseUrl!: String;
  dateRange?: (Date | undefined)[];
  ActualBlainePredictionChartData: any = [];
  actualPredictedChartDateRange?: (Date | undefined)[] = [moment().subtract(10, 'day').toDate(), moment().toDate()];
  chartDatasource: any;
  showChart: boolean = false;
  modalRef?: BsModalRef;
  historyDate?: any;
  allPlantsData: any;
  isDisabledDateFilter: boolean = true;
  accuracyBarData: any;
  accuracyDaysData: any;
  accuracyData: any;
  accuracy10!: number;
  isRole!: string;
  title:string='Blaine';
  unit:string='M2/Kg';
  drodownTitle: string='Grade';
  token!: string | null;
  urlLink:any
  constructor(
    private http: HttpClient, private authService: MsalService,
    private service: SocketService, private blainModel: blainModel,
    private toaster: ToasterService, private router: Router,
    private msalBroadcastService: MsalBroadcastService,
    private modalsvc: ModalService) { }


  adLogin() {
    this.flags.showData=false;
    var accessToken = localStorage.getItem('access_token');
    console.log(accessToken);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    // var url = "https://i4.utclconnect.com/uat/users/adLoginBasic";
    // var url = "https://i4.utclconnect.com/api/users/adLoginBasic";
    var url = `${environment.baseUrlApi}users/adLoginBasic`;
    // var url = "https://0207pwadeh.execute-api.ap-south-1.amazonaws.com/uat/users/adLoginBasic";
    // var url = environment.loginUrl;
    const httpOptions = {
      headers: headers
    };
    this.http.post(url, {}, httpOptions).subscribe(
      (result: any) => {
        localStorage.setItem('accessToken', result.data.token)
        localStorage.setItem('user', result.data.UserName)
        localStorage.setItem('userEmail',result.data.UserID)
        this.token=localStorage.getItem('accessToken')
        this.allPlantsData = result.data.Plants;
        // console.log(sessionStorage.getItem('accessToken'));
        
        if(result.data.Role=='super_admin'){
          this.isRole='admin';
          localStorage.setItem('role','admin');
        }
        else{
          this.isRole='user';
          localStorage.setItem('role','user');
        }

        var index = result.data.Modules.findIndex((item:any) => {
          return item.Module === 'OPT'
        })

        this.getIPAddress()


        if (index != -1) {
          this.router.navigate(['/home'])
          localStorage.setItem('hasOptAccess', 'true')
        }
        else {
          this.router.navigate(['/login'])
          localStorage.setItem('hasOptAccess', 'false')
        }
        
        var hasAccess = localStorage.getItem('hasOptAccess');
        // console.log(accessToken);
        
        if (hasAccess == 'true' && accessToken) {
          this.connect();
          this.getUser()
          // this.getInitialData();
          // this.getTable();
          // this.getAccuracyBarData();
          this.getDropDownData();
          // this.getAdjustmentData();
          let payload: any = this.payloadData
          // payload=JSON.stringify(payload)
          // this.send(payload)
        }
        else {
          this.router.navigate(['/login'])
        }

      },
      (error: any) => {
        this.router.navigate(['/login'])
      })

  }
  getIPAddress(){
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      console.log(res.ip);
      localStorage.setItem("Ip Address",res.ip)
    },(error:any)=>{
      console.log(error);
      
    })
  }

  ngOnInit() {
    // this.imagePath = {
    //   logo: '../../../assets/logo1.png',
    //   logoutImg: '../../../assets/icons8-logout-50.png',
    //   exportImg: '../../../assets/export.png'
    // }

    // console.log(moment().subtract(10, 'day').toDate());
    // this.flags.showData=false;
    this.imagePath = {
      logo: 'assets/logo1.png',
      logoutImg: 'assets/icons8-logout-50.png',
      exportImg: 'assets/export.png'
    }
    this.urlLink=window.location.href
    this.getDefaultDetails();
    this.adLogin()

  }

  getDateRange(event: any) {
    this.actualPredictedChartDateRange = event;
    
    
    this.getBlainePredictionChartDataForActualBlaine();
  }

  getExportDateRange(event: any) {
    this.dateRange = event;
  }

  getHistoryDate(event: any) {
    this.historyDate = event;
    // console.log(this.historyDate);
    
  }

  openModel(template: any) {
    this.modalRef = this.modalsvc.openModal(template);
  }

  public onSubmit() {

    this.adjustmentArray=[];
    if(this.payloadData.Mill.includes('RAML') || this.payloadData.Grade.includes('45MIC')){
      this.title="Residue";
      this.unit="%"
    }
    else{
      this.title="Blaine";
      this.unit="M2/Kg"
    }
    this.flags.showLoader=true;
    this.flags.showData=false;
    this.getInitialData();
    this.getTable();
    this.getAdjustmentData();
    if(this.isRole=='admin'){
      this.getAccuracyBarData();
    }
    
    
    let payload: any = this.payloadData
    console.log(payload);

    this.addLog(payload)

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.send(payload)

    this.intervalId = setInterval(() => {
      this.send(payload)
    }, 60000);

  }

  addLog(data:any){

    let option={
      "Plant":data.Plant_Code,
      "Mill":data.Mill,
      "Grade":data.Grade,
      "Model_No":data.Model_No
    }
    let email=localStorage.getItem("userEmail") 
    let ip=localStorage.getItem("Ip Address")
    let payload={
      "userId":email,
      "ip":ip,
      "module":"opt",
      "plant":data.Plant_Code,
      "url":this.urlLink,
      "options":JSON.stringify(option),
      "plant_or_section":"Blaine"
    }

    console.log(payload)

    this.blainModel.postCall(blainsUrl.addLog,payload,this.token).subscribe({
      next:(res:any)=>{
        console.log(res);
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  public onReset() {
    this.payloadData = {
      action: "blainOpt",
      Mill: 'null',
      Grade: 'null',
      Plant_Code: 'null',
      date: '',
      time: '',
      Model_No: 0
    }
  }

  public updateBlain() {
    let payload = {
      "Plant_Code": this.payloadData.Plant_Code,
      "Mill": this.payloadData.Mill,
      "Grade": this.payloadData.Grade,
      "Model_No": this.payloadData.Model_No.toString(),
      "hour": this.blainHour.toString(),
      "actualBlaine": this.userActualBlaine

    }
    this.blainModel.postCall(blainsUrlType.updateActualBlaineOneHour, payload, this.token).subscribe(
      (result: any) => {
        this.toaster.addSuccessToast();
        this.getTable()

      },

      (error: any) => {
        this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
      }
    )
  }

  public updateRecommendation() {
    let payload = {
      "Plant_Code": this.payloadData.Plant_Code,
      "Mill": this.payloadData.Mill,
      "Grade": this.payloadData.Grade,
      "Model_No": this.payloadData.Model_No,
      "dateTime": this.datasource.Date_Time,
      "isRecommendation": this.isRecommendation

    }
    this.blainModel.postCall(blainsUrlType.updateRecommadationForBlaine, payload, this.token).subscribe(
      (result: any) => {
        this.toaster.addSuccessToast();
      },

      (error: any) => {
        this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
      }
    )
  }


  public checkAdjustment(event: any) {
    if (event.target.checked == true) {
      this.adjustmentItems[event.target.id].isChecked = true;
    }
    else {
      this.adjustmentItems[event.target.id].isChecked = false;
    }
  }

  public updateAdjustment() {
    this.adjustmentItems.map((item:any)=>{
      if(item.isChecked==true){
        this.adjustmentArray.push(item.Iot_Tag_Id)
      }
    })
    let payload = {
      "Plant_Code": this.payloadData.Plant_Code,
      "Mill": this.payloadData.Mill,
      "Grade": this.payloadData.Grade,
      "Model_No": this.payloadData.Model_No,
      "dateTime": this.datasource.Date_Time,
      "adjustmentaRemark": this.adjustmentArray

    }

    this.blainModel.postCall(blainsUrlType.updateRemarksForBlaine, payload, this.token).subscribe(
      (result: any) => {
        if(result.status=='Failure'){
          this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
        }
        else{
          this.toaster.addSuccessToast();
        }
        
      },
      (error: any) => {
        this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
      })
  }

  public getAdjustmentData() {

    let payload = {
      "Plant_Code": this.payloadData.Plant_Code,
      "Mill": this.payloadData.Mill,
      "Grade": this.payloadData.Grade,
      "Model_No": this.payloadData.Model_No
    }

    this.blainModel.postCall(blainsUrlType.getAdjustmentData, payload,this.token).subscribe(
      (result: any) => {
        if (result && result.status == 'Success') {
          result.result.map((item: any) => {
            item.isChecked = false
          })
          this.adjustmentItems = result.result;
        }
        else {
          this.adjustmentItems = []
        }

        // this.toaster.addSuccessToast();
      },
      (error: any) => {
        this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
      }
    )
  }

  public getDropDownData() {
    this.flags.showLoader=true;
    let payload = {
      "Plant_Code": "",
      "Mill": "",
      "Grade": ""
    }

    this.blainModel.postCall(blainsUrlType.getDropDownData, payload, this.token).subscribe(
      (result: any) => {
        if (result && result.status == 'Success') {
          this.dropdownData = result.result;
          // if(this.allPlantsData){
          var modifiedFiltersData = this.blainModel.getPlantData(result.result, this.allPlantsData);
          this.plantData = modifiedFiltersData.plantData;
          this.flags.showLoader=false;
          // }
          // this.millsData=modifiedFiltersData.millsData;
          // this.gradeData=modifiedFiltersData.gradeData;

        }
        else {

        }

        // this.toaster.addSuccessToast();
      },
      (error: any) => {
        this.flags.showLoader=false;
        // this.router.navigate(['/login'])
        
        // this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
      }
    )
  }

  public parseDate(date:any){
    let newDate= new Date(date);
    var modifiedDate= (newDate.getFullYear()+'-'+ newDate.getDate()+'-'+newDate.getMonth()+' 00:00:00:04:00').toString();   
    return  moment.tz(modifiedDate+":00:00-00:00", "America/New_York"); 
    
  }

  public getAccuracyBarData(){
    let payload={

      "Plant_Code": this.payloadData.Plant_Code, 
      "Mill": this.payloadData.Mill,
      "Grade": this.payloadData.Grade
    }
    this.blainModel.postCall(blainsUrlType.getBlaineAccMTD, payload, this.token).subscribe(
      (result: any) => {
        // console.log(result);
        if(result.result[0].result!='No Record Found'){
          this.accuracyBarData=result.result;
          this.accuracy10= Math.round(result.result[0].Percentage_10)
        }
        else{
          this.accuracy10=0;
        }
       
        
      },
      (error:any)=>{
        this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
      })
  }

  public getAccuracyLineData(){
    let payload={

      "Plant_Code": this.payloadData.Plant_Code, 
      "Mill": this.payloadData.Mill,
      "Grade": this.payloadData.Grade
    }
    this.blainModel.postCall(blainsUrlType.getBlaineAccDaywiseMTD, payload, this.token).subscribe(
      (result: any) => {
        // console.log(result);
        this.accuracyData={data:result.result,type:'accuracyGraph'};

        
      },
      (error:any)=>{
        this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
      })
  }

  public getBlainePredictionChartDataForActualBlaine() {
    this.showChart = false;
    
    if (this.actualPredictedChartDateRange != undefined) {
      this.parseDate(this.actualPredictedChartDateRange[0])
      var payload = {
        "Plant_Code": this.payloadData.Plant_Code,
        "Mill": this.payloadData.Mill,
        "Grade": this.payloadData.Grade,
        "Model_No": this.payloadData.Model_No,
        "startDate": moment((this.actualPredictedChartDateRange[0])).format('YYYY-MM-DD 00:00:00'),
        "endDate": moment((this.actualPredictedChartDateRange[1])).format('YYYY-MM-DD 00:00:00'),
      }
      this.blainModel.postCall(blainsUrlType.getBlainePredictionChartDataForActualBlaine, payload,this.token).subscribe(
        (result: any) => {
          if (result.status == 'Success')
            this.ActualBlainePredictionChartData = result.result;
          this.chartDatasource = { data: this.ActualBlainePredictionChartData, type: 'MultiLine' }
          this.showChart = true;
        },
        (error: any) => {
          //  console.log(error);

        })
    }


  }


  onSelectDateRange(event: any) {
    this.getBlainePredictionChartDataForActualBlaine();
  }


  public export() {

    if (this.dateRange != undefined) {
      let payload = {
        "Plant_Code": this.payloadData.Plant_Code,
        "Mill": this.payloadData.Mill,
        "Grade": this.payloadData.Grade,
        "Model_No": this.payloadData.Model_No,
        "StartDate": moment(this.dateRange[0]).format('YYYY-MM-DD 00:00:00'),
        "EndDate": moment(this.dateRange[1]).format('YYYY-MM-DD 23:59:59'),
      }
      this.blainModel.postCall(blainsUrlType.exportCSVUrl, payload,this.token).subscribe(
        (result: any) => {
          if (result && result.status == 'Success') {
            window.open(result.result.url)
          }
          if (result && result.status == 'Failure') {
            this.toaster.addErrorToast('No data found for selected date range');
          }
        },
        (error: any) => {
          this.toaster.addErrorToast('Something Went Wrong, Please Try Again');
        })
    }



  }

  public getMillsBasesPlant() {
    this.gradeData = [];
    this.millsData = [];
    this.modelData = [];
    this.payloadData.Mill = 'null';
    this.payloadData.Grade = 'null';
    this.millsData = this.blainModel.getMillsBasesPlant(this.payloadData.Plant_Code, this.dropdownData)
  }

  public getGradeBasesPlantMills() {
    // console.log(this.payloadData.Mill);
    this.payloadData.Grade = 'null';
    this.gradeData = this.blainModel.getGradeBasesPlantMills(this.payloadData.Plant_Code, this.payloadData.Mill, this.dropdownData)
    if(this.payloadData.Mill.includes('RAML')){
      this.drodownTitle='Micron';
    }
    else{
      this.drodownTitle='Grade';
    }
  }


  public getModelBasedOnGrade() {
    this.modelData = this.blainModel.getModelBasedOnGrade(this.payloadData.Grade, this.payloadData.Plant_Code, this.payloadData.Mill, this.dropdownData)
    if(this.payloadData.Grade.includes('45MIC')){
      this.drodownTitle='Micron';
    }
    else{
      this.drodownTitle='Grade';
    }
  }

  public getDefaultDetails() {
    // this.flags.showNoData=true;
    // this.flags.showData=false;

    // this.millsData=this.blainModel.getMilllsData(); 
    // this.gradeData=this.blainModel.getGradeData(); 
    // this.plantData=this.blainModel.getPlantData();
    this.hoursData = this.blainModel.generateArray();
    this.flags = this.blainModel.getIntialFlagStats();

  }

  public getCurrentHourDropDown(){
    console.log("click");
    
    this.hoursData = this.blainModel.generateArray();
  }

  public getInitialData() {

    this.blainModel.postCall(blainsUrlType.getLatestFilteredData, this.payloadData,this.token).subscribe(
      (result: any) => {

        if (result && result.status == 'Success') {
          this.flags.showLoader=false;
          this.flags.showData=true;
          this.parseLatestFilterData(result)
        }
        else {
          if (result && result.status == 'Failure') {
            this.flags = this.blainModel.getFlagsStatusAfterFailure();
          }

        }

      },
      (error: any) => {
        this.flags = this.blainModel.getFlagsStatusAfterFailure();
      }
    )

  }

  public parseLatestFilterData(result: any) {
    this.datasource = result.result;
    var date = new Date(this.datasource.Date_Time);
    this.isRecommendation = this.datasource.Is_Recmdn_Ack;
    this.userActualBlaine = this.datasource.Actual_Blaine;

    this.payloadData = {
      action: "blainOpt",
      Mill: this.datasource.Mill,
      Grade: this.datasource.Grade,
      Plant_Code: this.datasource.Plant_Code,
      date: this.datasource.Date_Time.toString().slice(0, 10),
      time: this.datasource.Date_Time.toString().slice(11, 16),
      Model_No: this.datasource.Model_No
    }
    this.historyDate = new Date(this.datasource.Date_Time);
    this.historyDate = new Date(this.historyDate.getTime() + this.historyDate.getTimezoneOffset() * 60000);
    this.isDisabledDateFilter = false;

    this.flags = this.blainModel.getFlagsStatusAfterSucess();

    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.contentRef);

    // this.adjustmentItems=this.blainModel.getAdjustmentData();
    this.adjustmentItems = this.blainModel.mapAdjustmentWithData(this.datasource, this.adjustmentItems);
  }

  public getTable() {
    this.blainModel.postCall(blainsUrlType.getLastTwoHrsData, this.payloadData,this.token).subscribe(
      (result: any) => {
        if (result && result.status == 'Success') {
          this.tableData = result.result;
        }
        else {
          if (result && result.status == 'Failure') {
            this.tableData = [];
          }
        }
      },
      (error: any) => {
        // this.flags.showChart = true;
        // this.flags.showNoData = true;
      }
    )
  }

  public getPreviousData() {
    if (this.historyDate) {
      let newMin = Math.floor(this.historyDate.getMinutes() / 10) * 10;
      const newDate = moment(this.historyDate).set('minutes', newMin).toDate();
      // console.log(newDate,new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60000));

      let payload = {
        "Plant_Code": this.payloadData.Plant_Code,
        "Mill": this.payloadData.Mill,
        "Grade": this.payloadData.Grade,
        "Model_No": this.payloadData.Model_No,
        // "dateTime": newDate
        "dateTime": this.historyDate
      }
      this.blainModel.postCall(blainsUrlType.getPredictionDataWithDatetime, payload,this.token).subscribe(
        (result: any) => {
          this.parseLatestFilterData(result)

        },
        (error) => {
          // console.log(error);

        }
      )
    }

  }

  public getUser() {
    this.username = localStorage.getItem('user');
    if (this.username) {
      // this.username= this.username.split('@')[0];
      this.username = this.username;
    }

  }

  public logout() {
    localStorage.clear()
    sessionStorage.clear()
    this.authService.logout()
  }

  public send(msg: any) {
    this.service.send(msg).subscribe(
      (result: any) => {
        // console.log("fhgihgohgt",result)

        if (result && result.LatestData && result.LatestData.status == 'Success') {
          this.datasource = result.LatestData.result;
          this.tableData = result.LastTwoHoursData.result;
          var date = new Date(this.datasource.Date_Time);
          this.isRecommendation = this.datasource.Is_Recmdn_Ack;
          this.userActualBlaine = this.datasource.Actual_Blaine;
          this.payloadData = {
            action: "blainOpt",
            Mill: this.datasource.Mill,
            Grade: this.datasource.Grade,
            Plant_Code: this.datasource.Plant_Code,
            date: this.datasource.Date_Time.toString().slice(0, 10),
            time: this.datasource.Date_Time.toString().slice(11, 16),
            Model_No: this.datasource.Model_No
          }
          // this.flags.showChart = true;
          // this.flags.showNoData = false;
          // this.flags.showLoader = false;

          this.outletRef.clear();
          this.outletRef.createEmbeddedView(this.contentRef);

          // this.adjustmentItems=this.blainModel.getAdjustmentData();
          this.adjustmentItems = this.blainModel.mapAdjustmentWithData(this.datasource, this.adjustmentItems);
        }
        // else {
        //   if (result && result.LatestData.status == 'Failure')
        //     this.flags.showChart = false;
        //   this.flags.showLoader = false;
        //   this.flags.showNoData = true;
        // }

      },
      (error: any) => {
        // console.log(error)
        // this.flags.showChart = false;
        // this.flags.showLoader = false;
        // // this.flags.showNoData = true;
      }
    )

  }

  public connect() {
    this.service.connect();
  }

  public disconnect() {
    this.service.disconnect();
  }

  ngOnDestroy(){
       // Clear the interval when the component is destroyed to prevent memory leaks
       if (this.intervalId) {
        clearInterval(this.intervalId);
      }
  }

}


