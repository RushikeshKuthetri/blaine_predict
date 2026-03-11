import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Chart,registerables} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import * as moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {
  chart: any;
  @Input() data:any;
  @Input() title:any;
  @Input() daterange:any;
  labelsArray:any=[];
  valueArray:any=[];
  noData:boolean=false;
  chart2: any;
  @ViewChild("outlet", { read: ViewContainerRef })
  outletRef!: ViewContainerRef;
  @ViewChild("content", {read: TemplateRef}) contentRef!: TemplateRef<any>;
  constructor(){
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    Chart.register(ChartDataLabels);
   }


   ngOnInit(){

    
  console.log(this.data);
  
  }

  resetZoomBtn = () => {
  
    this.chart2.resetZoom()
    
  };
   

  calcDate(date1:any,date2:any) {
    let d1= moment(date1);
    let d2= moment(date2)
    let seconds= d2.diff(d1,'seconds');
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    if(d>0 && h>0){
      return  d + ' Days' + h +' Hours';
    }else if ( d ===0  && h>0 ){
      return  h +' Hours';
    }else if( d > 0 && h ===0 ){
      return  d + ' Days';
    }
    else{
      return ''
    }

  
  // return (difdt.toISOString().slice(0, 4) - 1970) + "Y " + (difdt.getMonth()+1) + "M " + difdt.getDate() + "D")
    }

  ngOnChanges(){
    // console.log(this.daterange);
    this.noData=true;
    // this.outletRef?.clear();
    // this.outletRef?.createEmbeddedView(this.contentRef);
    // console.log(this.data)
    this.chart2?.destroy();
    if(this.data.type=='accuracyGraph'){
      console.log(this.data);
      
      let range5Values:any=[];
      let range6Values:any=[];
      let range7Values:any=[];
      let range10Values:any=[];
      var labelValues:any=[];
      this.data.data.map((item:any)=>{
        item.range5=Math.floor((Math.random() * 250) + 50);
        item.range6=Math.floor((Math.random() * 250) + 50);
        item.range7=Math.floor((Math.random() * 250) + 50);
        item.range10=Math.floor((Math.random() * 250) + 50);
      })
      console.log(this.data.data);
      

      this.data.data.map((item:any)=>{
        range5Values.push(item.Percentage_5);
        range6Values.push(item.Percentage_6);
        range7Values.push(item.Percentage_7);
        range10Values.push(item.Percentage_10);
        labelValues.push(item.date)
      })
      let ctx: any = document.getElementById('lineChart') as HTMLElement;
      let data= {
        labels:labelValues,
        datasets: [
          {
            label: '±10',
            data: range10Values,
            backgroundColor: '#198754',
            borderColor: '#198754',
            fill: false,
            lineTension: 0,
            radius: 2,
          },
          // {
          //   label:'±7',
          //   data:range7Values,
          //   backgroundColor: '#ced4da',
          //   borderColor: '#ced4da',
          //   fill: false,
          //   lineTension: 0,
          //   radius: 2,
          //   hidden:true

          // },
          // {
          //   label:'±6',
          //   data: range6Values,
          //   backgroundColor: '#ced4da',
          //   borderColor: '#ced4da',
          //   fill: false,
          //   lineTension: 0,
          //   radius: 2,
          //   hidden:true
          // },
          // {
          //   label:'±5',
          //   data: range5Values,
          //   backgroundColor: '#ced4da',
          //   borderColor: '#ced4da',
          //   fill: false,
          //   lineTension: 0,
          //   radius: 2,
          //   hidden:true
          // },
        ],
      };

      //options
      // var options = {
      //   responsive: true,
      //   title: {
      //     display: true,
      //     position: 'top',
      //     text: 'Line Graph',
      //     fontSize: 18,
      //     fontColor: '#111',
      //   },
      //   legend: {
      //     display: false,
      //     position: 'bottom',
      //     labels: {
      //       fontColor: '#333',
      //       fontSize: 16,
      //     },
      //   },
      // };

      this.chart2 = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter:function(value, context) {
                return Math.round(value) + '%';
              },
              font: {
                weight: 'bold',
                size: 16
              }
            },
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max:100
            }
          }
        },
      });

      this.noData=false;
    }
      
    if(this.data.type=='MultiLine'){
      if( this.data.data[0].result!='No Record Found'){
        // console.log(this.data)
        var actualBlaineValues: any[]=[];
        var predictedBlaineValues: any[]=[];
        var labelsValue: any[]=[];
        this.data.data.map((item:any)=>{
          actualBlaineValues.push(item.Actual_Blaine?item.Actual_Blaine:0)
          predictedBlaineValues.push(item.Predicted_Blaine?item.Predicted_Blaine:0);
          labelsValue.push(new Date(item.Date_Time).toDateString()+'  '+item.Date_Time.slice(11,16))
        })
        console.log(labelsValue);
      
        let ctx: any = document.getElementById('lineChart') as HTMLElement;
        let startDateLabel=new Date(this.daterange[0]).toUTCString();
        let endDateLabel=new Date(this.daterange[1]).toUTCString()
        // var hours = Math.abs(this.daterange[0] - this.daterange[1]) / 36e5;
        let diffHours=this.calcDate(startDateLabel,endDateLabel)
        var data = {
          labels: labelsValue,
          // labels:[startDateLabel,diffHours,endDateLabel],
          datasets: [
            {
              label: 'Predicted Blaine',
              data: predictedBlaineValues,
              backgroundColor: 'blue',
              borderColor: 'lightblue',
              fill: false,
              lineTension: 0,
              radius: 2,
            }
            // {
            //   label:'Actual Blaine',
            //   data: actualBlaineValues,
            //   backgroundColor: 'green',
            //   borderColor: 'lightgreen',
            //   fill: false,
            //   lineTension: 0,
            //   radius: 2,
            // },
          ],
        };
  
        //options
     
        // var options = {
        //   responsive: true,
        //   title: {
        //     display: true,
        //     position: 'top',
        //     text: 'Line Graph',
        //     fontSize: 18,
        //     fontColor: '#111',
        //   },
        //   legend: {
        //     display: true,
        //     position: 'bottom',
        //     labels: {
        //       fontColor: '#333',
        //       fontSize: 16,
        //     },
        //   }
        // };
  
        this.chart2 = new Chart(ctx, {
          type: 'line',
          data: data,
          options: {
            plugins: {
              
              datalabels:{
                display: false,
              },
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'x',
                  scaleMode:'x'
                }
              }
            }, 
            responsive: true,
          }
         });
        this.noData=false;
      }

      else{
        this.noData=true;
      }
    }
    else{
      if(this.data.length>0){
        this.data.map((item:any)=>{
          this.labelsArray.push(item.Date_Time)
          this.valueArray.push(item.Process_Values.toFixed(2))
        })
    
        // console.log(this.valueArray, this.labelsArray)
        let ctx: any = document.getElementById('lineChart') as HTMLElement;
        var data2 = {
          labels: this.labelsArray,
          // labels:['1','2','3'],
          datasets: [
            {
              label: this.title,
              data: this.valueArray,
              backgroundColor: 'green',
              borderColor: 'lightgreen',
              fill: false,
              lineTension: 0,
              radius: 2,
            },
            
          ],
        };
    
        //options
        // var options = {
        //   responsive: true,
        //   title: {
        //     display: true,
        //     position: 'top',
        //     text: 'Line Graph',
        //     fontSize: 18,
        //     fontColor: '#111',
        //   },
        //   legend: {
        //     display: true,
        //     position: 'bottom',
        //     labels: {
        //       fontColor: '#333',
        //       fontSize: 16,
        //     },
        //   },
        // };
        
        this.chart2 = new Chart(ctx, {
          type: 'line',
          data: data2,
          options: {
            
            plugins: {
              datalabels:{
                display: false,
              },
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'x',
                }
              }
            }, 
            responsive: true,
          }
        });
        
        this.noData=false;
      }
      else{
        this.noData=true;
      }
      
    }
      
  }
}

  

   

  
