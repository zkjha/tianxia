import {AfterViewInit, Component, OnInit} from '@angular/core';

declare var echarts: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit , AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.initChart();
  }
  

  initChart(data) {
    console.log(data)
    // 基于准备好的dom，初始化echarts图表
    let myChart = echarts.init(document.getElementById('main'));

    const option = {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data: [data.data[0]['name'], data.data[1]['name']]
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data :data['time']
        }
      ],
      yAxis : [
        {
          type : 'value',
          axisLabel : {
            formatter: '{value}'
          }
        }
      ],
      series : [
        {
          name: data.data[0]['name'],
          type: 'line',
          itemStyle : {
            normal : {
              lineStyle: {
                color: '#000000'
              }
            }
          },
          data: data.data[0]['data'],
          // markPoint : {
          //   data : [
          //     {type : 'max', name: '最大值'},
          //     {type : 'min', name: '最小值'}
          //   ]
          // },
          // markLine : {
          //   data : [
          //     {type : 'average', name: '平均值'}
          //   ]
          // }
        },
        {
          name:data.data[1]['name'],
          type: 'line',
          data: data.data[1]['data'],
          // markPoint : {
          //   data : [
          //     {name : '最低', type : 'min'},
          //     {name : '最高', type : 'max'}
          //   ]
          // },
          // markLine : {
          //   data : [
          //     {type : 'average', name : '平均值'}
          //   ]
          // }
        }
      ]
    };


    // 为echarts对象加载数据
    myChart.setOption(option);
  }

}

