import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ɵExtraLocaleDataIndex } from '@angular/core';
import * as d3 from "d3";
import {blainModel,blainsUrlType} from '../../pages/home/blainModel.model';
import {environment} from '../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponents implements OnChanges {
  @Input() datasource: any;
  gaugemap: any = {};
  showChrts: any = false;
  @ViewChild("outlet", { read: ViewContainerRef })
  outletRef!: ViewContainerRef;
  graphDateRange?: (Date | undefined)[]=[moment().subtract(10, 'day').toDate(), moment().toDate()]
  @ViewChild("content", {read: TemplateRef}) contentRef!: TemplateRef<any>;
  @Input() payload:any;
  barData:any=[];
  showBar=false;
  showLine:boolean=false;
  title!:string
  blaineUrls:blainsUrlType={
    'updateActualBlaineOneHour': environment.baseUrl+ 'updateActualBlaineOneHour',
    'updateRecommadationForBlaine':environment.baseUrl+'updateRecommadationForBlaine',
    'updateRemarksForBlaine':environment.baseUrl+'updateRemarksForBlaine',
    'getLatestFilteredData':environment.baseUrl+'getLatestFilteredData',
    'getLastTwoHrsData':environment.baseUrl+'getLastTwoHrsData',
    'getBarChartData':environment.baseUrl+'getBlainePredictionChartData',
  }

  @ViewChild('myTestDiv') divElementRef?:ElementRef;
  div2Element?:HTMLElement
  @ViewChild('myTestDiv2') div2ElementRef?:ElementRef;
  divElement?: HTMLElement;
  hoursData!: number[];
  historyHours:any="2";
  modalRef?: BsModalRef;
  token:any
  constructor(private blainModel:blainModel,private cdr: ChangeDetectorRef,private modalService: BsModalService) {
    
  }
  ngOnInit():void{
    this.token=localStorage.getItem('accessToken')
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getDateRange(event:any){
    this.graphDateRange=event;
    this.onSelectDateRange();

    
  }

  onSelectDateRange(){
    this.showLine=false;
    if(this.graphDateRange !=undefined){
      this.payload.startDate= moment(this.graphDateRange[0]).format('YYYY-MM-DD 00:00:00');
      this.payload.endDate= moment(this.graphDateRange[1]).format('YYYY-MM-DD 00:00:00');
    }
    this.payload.Hours=this.historyHours;
      this.blainModel.postCall(this.blaineUrls.getBarChartData,this.payload,this.token).subscribe(
        (result:any)=>{
          if(result.result[0].result!="No Record Found"){
            // console.log(result);
            
            this.barData=result.result;
            this.barData.map((item:any)=>{
            item.color=this.generateColor();
            item.Date_Time= item.Date_Time.slice(11,16);
            })
            this.showLine=true;
            // if(this.barData && this.barData.length>0){
            //   this.outletRef.clear();
            //   this.outletRef.createEmbeddedView(this.contentRef);
            // }
          }
          else{
            this.barData=[];
            this.showLine=true;
          }
          
          
        },
        (error:any)=>{
          // console.log(error)
        }
      )
    
  }  


  getBarData(event:any, item:any, index:any){
    if(this.graphDateRange !=undefined){
      this.payload.startDate= this.graphDateRange[0];
      this.payload.endDate= this.graphDateRange[1];
    }

    // delete this.payload.date;
    // delete this.payload.time;
    this.title=item.Generic_Description;
    this.payload.Tag_Id=item.IoT_Tag_Id;;
      
      this.blainModel.postCall(this.blaineUrls.getBarChartData,this.payload, this.token).subscribe(
        (result:any)=>{
          if(result.result[0].result!="No Record Found"){
            this.barData=result.result;
            // console.log(this.barData)
            this.showLine=true;
            this.barData.map((item:any)=>{
            item.color=this.generateColor();
            item.Date_Time= item.Date_Time.slice(11,16);
            })
            if(this.barData && this.barData.length>0){
              this.outletRef?.clear();
              this.outletRef?.createEmbeddedView(this.contentRef);
            }

          
          }
          else{
            this.barData=[];
          }
          
          
        },
        (error:any)=>{
          // console.log(error)
        }
      )
  }

  onHourChange(){
    this.showLine=false;
    this.payload.Hours=this.historyHours;
      this.blainModel.postCall(this.blaineUrls.getBarChartData,this.payload,this.token).subscribe(
        (result:any)=>{
          if(result.result[0].result!="No Record Found"){
            this.barData=result.result;
            this.barData.map((item:any)=>{
            item.color=this.generateColor();
            item.Date_Time= item.Date_Time.slice(11,16);
            })
            this.showLine=true;
            if(this.barData && this.barData.length>0){
              this.outletRef.clear();
              this.outletRef.createEmbeddedView(this.contentRef);
            }
          }
          else{
            this.barData=[];
            this.showLine=true;
          }
          
          
        },
        (error:any)=>{
          // console.log(error)
        }
      )
  }

  generateColor = () =>  {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(this.datasource).length > 0) {
      setTimeout(() => {
        this.datasource.Tags_Data.map((item: any,index:any) => {
          item.showGuage=true;
          this.draw(item.IoT_Tag_Id, item.Process_Values,index);
        })
      }, 100);

      // this.outletRef.clear();
      // this.outletRef.createEmbeddedView(this.contentRef);
      
      
    }

    this.hoursData=this.blainModel.generateArray()
  }
 


  draw(id: any, value: any,index:any) {
    var self = this;
    // var majorTicks=Math.floor(Math.ceil(value)+50)/10;
    var majorTicks=6;
    
    if(this.payload.Mill.includes('RAML') || this.payload.Grade.includes('45MIC')){
      this.title="Residue";
      var arcColor:String='#778899';
    }
    else{
      var arcColor:String='#fff500';
    }
    var maxValue=Math.ceil(value / 10) * 10 +100

    // if(value<500){
    //   arcColor='#2dc937'
    // }
    // if(value>500 && value<1500){
    //   arcColor='#fff500'
    // }
    // if(value>1500){
    //   arcColor='#cc3232'
    // }
    var gauge = function (container: any, configuration: any) {

      var config: any = {
        size:1000,
        // clipWidth: 200,
        // clipHeight: 110,
        ringInset: 20,

        pointerWidth: 5,
        pointerTailLength: 10,//
        pointerHeadLengthPercent: 0.9,

        minValue: 0,
        // maxValue: 10,

        minAngle: -90,
        maxAngle: 90,

        transitionMs: 750,

        majorTicks: `${majorTicks}`,
        // majorTicks:10,
        labelFormat: d3.format('d'),
        labelInset: 15,

        arcColorFn: d3.interpolateHsl(d3.rgb(`${arcColor}`), d3.rgb(`${arcColor}`))
      };
      var range: any = undefined;
      var r: any = undefined;
      var pointerHeadLength: any = undefined;
      var value = 0;

      var svg: any = undefined;
      var arc: any = undefined;
      var scale: any = undefined;
      var ticks: any = undefined;
      var tickData: any = undefined;
      var pointer: any = undefined;

      var donut = d3.pie();

      function deg2rad(deg: any) {
        return deg * Math.PI / 180;
      }

      function newAngle(d: any) {
        var ratio = scale(d);
        var newAngle = config.minAngle + (ratio * range);
        return newAngle;
      }

      function configure(configuration: any) {
        var prop = undefined;
        for (prop in configuration) {
          config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale this.gaugemap maps domain values to a percent from 0..1
        scale = d3.scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

        arc = d3.arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function (d: any, i: any) {
            var ratio = d * i;
            return deg2rad(config.minAngle + (ratio * range));
          })
          .endAngle(function (d: any, i: any) {
            var ratio = d * (i + 1);
            return deg2rad(config.minAngle + (ratio * range));
          });
      }
      self.gaugemap.configure = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return (svg !== undefined);
      }
      self.gaugemap.isRendered = isRendered;

      function render(newValue: any) {
        svg = d3.select(container)
        .classed("svg-container", true)
          .append('svg:svg')
          .attr('class', 'gauge gauge_meter')
          // .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "-10 -8 600 400")
   //class to make it responsive
   .classed("svg-content-responsive", true);
         

        var centerTx = centerTranslation();

        var arcs = svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs.selectAll('path')
          .data(tickData)
          .enter().append('path')
          .attr('fill', function (d: any, i: any) {
            return config.arcColorFn(d * i);
          })
          .attr('d', arc);

        var lg = svg.append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);
        lg.selectAll('text')
          .data(ticks)
          .enter().append('text')
          .attr('transform', function (d: any, index:any) {
            var ratio = scale(d);
            var newAngle = config.minAngle + (ratio * range);
            // return 'rotate(' + newAngle + ') translate(-8,' + (config.labelInset - r) + ')';
            if(index%2==0 && index>6){
              return 'rotate(' + 0 + ') translate(260,4' + ')';
            }
            else{
              return 'rotate(' + newAngle + ') translate(-8,' + (config.labelInset - r) + ')';

            }
            
          })
          .text(config.labelFormat);

        var lineData = [[config.pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(config.pointerWidth / 2), 0],
        [0, config.pointerTailLength],
        [config.pointerWidth / 2, 0]];
        var pointerLine = d3.line().curve(d3.curveLinear)
        var pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
          .attr('transform', 'rotate(' + config.minAngle + ')')

        update(newValue === undefined ? 0 : newValue);
      }
      self.gaugemap.render = render;
      function update(newValue: any, newConfiguration?: any) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + (ratio * range);
        pointer.transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }
      self.gaugemap.update = update;

      configure(configuration);

      return self.gaugemap;
    };
    // Math.floor(Math.random()*(999-100+1)+100)
    var size=window.innerWidth
    var powerGauge = gauge(`#g${index}`, {
      size: 550,
      clipWidth: 600,
      clipHeight: 100,
      ringWidth: 150,
      // maxValue: Math.ceil(value / 10) * 10 
      maxValue: `${maxValue}`,
      transitionMs: 4000,
      // size: 150,
      // clipWidth: 150,
      // clipHeight: 150,
      // ringWidth: 20,
      // maxValue: Math.ceil(value / 10) * 10 + 100,
      // transitionMs: 4000,

    });
    powerGauge.render(value);
    this.showChrts = true
    // var powerGauge = gauge('#millTempOl', {
    //   size: 300,
    //   clipWidth: 300,
    //   clipHeight: 300,
    //   ringWidth: 30,
    //   maxValue: 10,
    //   transitionMs: 4000,
    // });
    // powerGauge.render(7);
    // var powerGauge = gauge('#millRejectFlow', {
    //   size: 300,
    //   clipWidth: 300,
    //   clipHeight: 300,
    //   ringWidth: 30,
    //   maxValue: 10,
    //   transitionMs: 4000,
    // });
    // powerGauge.render(8);
    // var powerGauge = gauge('#millTempIl', {
    //   size: 300,
    //   clipWidth: 300,
    //   clipHeight: 300,
    //   ringWidth: 30,
    //   maxValue: 10,
    //   transitionMs: 4000,
    // });
    // powerGauge.render(5);

    // var powerGauge = gauge('#badHeight', {
    //   size: 300,
    //   clipWidth: 300,
    //   clipHeight: 300,
    //   ringWidth: 30,
    //   maxValue: 10,
    //   transitionMs: 4000,
    // });
    // powerGauge.render(10);
    // var powerGauge = gauge('#grindingPr', {
    //   size: 300,
    //   clipWidth: 300,
    //   clipHeight: 300,
    //   ringWidth: 30,
    //   maxValue: 10,
    //   transitionMs: 4000,
    // });
    // powerGauge.render(5);

  }
}
