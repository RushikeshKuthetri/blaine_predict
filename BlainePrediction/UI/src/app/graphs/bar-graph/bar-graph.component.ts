import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import { Chart, ChartType, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';






@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss']
})

export class BarGraphComponent{
  chart: any;
  @Input() data:any;
  public lineChartType: ChartType = "bar";
  dataset: any;
  constructor(){
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
  }
  ngOnChanges(){
    this.chart?.destroy();
    let ctx: any = document.getElementById('barChart') as HTMLElement;
    console.log(this.data);
    
    const labels = ['±10','±7','±6','±5'];
    if(this.data){
      this.dataset = {
        labels: labels,
        datasets: [{
          label: '',
          
          data: [this.data[0]?.Percentage_10, this.data[0]?.Percentage_7, this.data[0]?.Percentage_6, this.data[0]?.Percentage_5],
          backgroundColor: [
            '#198754',
            '#ced4da',
            '#ced4da',
            '#ced4da'
          ],
          borderColor:  [
            '#198754',
            '#ced4da',
            '#ced4da',
            '#ced4da'
          ],
          borderWidth: 1
        }]

        
        
      };
  
    }
   
    const config = {
      // plugins: [ChartDataLabels],
      type: this.lineChartType,
      data: this.dataset,
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: {
              weight: 'bold',
              size: 16
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max:100
          }
        }
      },
    };

    this.chart = new Chart(ctx,{
      type: this.lineChartType,
      data: this.dataset,
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
            display: false
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
  }
}


// export class BarGraphComponent implements OnChanges{
//   @Input() data: any;
//   @ViewChild("outlet", { read: ViewContainerRef })
//   outletRef!: ViewContainerRef;
//   hoursData:any;
  
//   @ViewChild("content", {read: TemplateRef}) contentRef!: TemplateRef<any>;
//   // public data: any = [
//   //   { name: "abc-1", value: '200', color: "#9954E6" },
//   //   { name: "abc-2", value: '100', color: "#63adfeb3" },
//   //   { name: "abc-3", value: '500', color: "#533a84" },
//   //   { name: "abc-4", value: '300', color: "#dd8050c4" },
//   //   { name: "abc-5", value: 50, color: "#BF60C4" }
//   // ];



//   @Input("title") public title: any;
//   @Input("id") public id: any;
//   public chartId;
//   private highestValue: any=1000;
//   private svg: any;
//   private margin = 100;
//   private width = 1000 - this.margin * 2;
//   private height = 600 - this.margin * 2;
//   constructor(private d3: GraphService,private blainModel:blainModel) {
//     this.chartId = this.d3.generateId(5);
//   }
//   ngOnChanges(changes: SimpleChanges): void{

//     if(this.data&&this.data.length>0){
//       let tableLength = this.data.length;
//       this.data.map((item:any,index:any)=>{
//         if(item.Process_Values>this.highestValue){
//           this.highestValue=item.Process_Values;
//         }
//         if(index%2!==0){
//           item.class='y-tick';
//         } 
//         else{
//           item.class='';
//         }
//       })
//     }
//     else{
//       let tableLength = 0
//     }
//     if(this.data && this.data.length>0){
//       let tableLength = this.data.length;
//       this.data.map((item:any,index:any)=>{
//         if(item.Process_Values>this.highestValue){
//           this.highestValue=item.Process_Values;
//         }
//         if(index%2!==0){
//           item.class='y-tick';
//         } 
//         else{
//           item.class='';
//         }
//       })
//       this.outletRef.clear();
//       this.outletRef.createEmbeddedView(this.contentRef);
//       setTimeout(()=>{
//       this.createSvg();
//       this.drawBars(this.data);
//       },100)
      
//     }
//   }

//   ngOnInit(): void {
//     // determining highest value
   
//     let highestCurrentValue = 0;
    
    
//   }

//   ngAfterViewInit(): void {
    
//   }

//   private createSvg(): void {
    
//     this.svg = this.d3.d3
//       .select(`div#${this.id}`)
//       .append("svg")
//       .attr(
//         "viewBox",
//         `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 2}`
//       )

//       .append("g")
//       .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
   
//   }

//   private drawBars(data: any[]): void {
//     // Creating X-axis band scale
//     const x = this.d3.d3
//       .scaleBand()
//       .range([0, this.width])
//       .domain(data.map(d => d.Date_Time))
//       .padding(0.2);

//     // Drawing X-axis on the DOM
//     this.svg
//       .append("g")
//       .attr("transform", "translate(0," + this.height + ")")
//       .call(this.d3.d3.axisBottom(x))
//       .selectAll("text")
//       // .attr('transform', 'translate(-10, 0)rotate(-45)')
//       // .style('text-anchor', 'end')
//       .style("font-size", "15px")
//       .attr('class',(f: any,index:any) =>data[index].class);

//     // Creaate Y-axis band scale
//     const y = this.d3.d3
//       .scaleLinear()
//       .domain([0, Number(this.highestValue) + 50])
//       .range([this.height, 0]);

//     // Draw the Y-axis on the DOM
//     this.svg
//       .append("g")
//       .call(this.d3.d3.axisLeft(y))
//       .selectAll("text")
//       .style("font-size", "14px");

//     // Create and fill the bars
//     this.svg
//       .selectAll("bars")
//       .data(data)
//       .enter()
//       .append("rect")
//       .attr("x", (d: any) => x(d.Date_Time))
//       .attr("y", (d: any) => y(d.Process_Values))
//       .attr("width", x.bandwidth())
//       .attr("height", (d: any) =>
//         y(d.Process_Values) < this.height ? this.height - y(d.Process_Values) : this.height
//       ) // this.height
//       .attr("fill", (d: any) => d.color);

//     this.svg
//       .selectAll("text.bar")
//       .data(data)
//       .enter()
//       .append("text")
//       .attr("x", (f: any) => x(f.Date_Time))
//       // .attr('transform', 'translate(100px,10px)')
//       .attr("text-anchor", "start")
//       .attr("fill", "#70747a")
//       .attr("y", (d: any) => y(d.Process_Values) - 5)
//       .text((d: any) => (Math.round(d.Process_Values * 100) / 100).toFixed(0));
//   }
// }
