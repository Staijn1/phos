import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxEchartsDirective, provideEcharts} from 'ngx-echarts';
import {EChartsOption, LineSeriesOption} from 'echarts';
import {WebsocketService} from '../../../services/websocketconnection/websocket.service';


@Component({
  selector: 'app-power-draw',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './power-draw.component.html',
  styleUrls: ['./power-draw.component.scss'],
  providers: [
    provideEcharts()
  ]
})
export class PowerDrawComponent implements OnInit, OnDestroy {
  chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      boundaryGap: [0, '50%'],
      type: 'value'
    },
    series: [
      {
        name: 'Test',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: []
      }
    ]
  };

  updateOptions!: EChartsOption;
  data: SingleSeriesData[] = [];
  timestamps: string[] = [];
  private getDataInterval: NodeJS.Timeout | undefined;

  constructor(private readonly websocketService: WebsocketService) {
  }


  ngOnInit() {
    this.startPollingData();
  }

  public startPollingData() {
    this.getDataInterval = setInterval(async () => {
      const powerEstimates = await this.websocketService.getPowerDrawEstimateData();

      const nowString = new Date().toLocaleTimeString('en-US', {hour12: false});
      this.timestamps.push(nowString);

      /*const series: LineSeriesOption[] = [];

      Object.entries(powerEstimates).forEach(([deviceName, powerEstimate]) => {
        const existingSeries = series.find(s => s.name === deviceName);
        const datapoint = {category: nowString, value: powerEstimate};

        if (existingSeries) {
          existingSeries.data = existingSeries.data as SingleSeriesData[];

          if (existingSeries.data.length > 30) {
            existingSeries.data.shift();
            this.timestamps.shift();
          }

          existingSeries.data.push(datapoint);
        } else {
          series.push({
            name: deviceName,
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [datapoint]
          });
        }
      });*/

      this.data.push({category: nowString, value: powerEstimates['Test']});

      // Merge new data into chart options
      this.updateOptions = {
        xAxis: {
          data: this.timestamps
        },
        series: [
          {
            data: this.data
          }
        ]
      };
    }, 1000);
  }


  ngOnDestroy() {
    clearInterval(this.getDataInterval);
  }
}


export type SingleSeriesData = {
  category: string;
  value: number;
}
