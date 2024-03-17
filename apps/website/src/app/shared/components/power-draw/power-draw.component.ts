import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocketconnection/websocket.service';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { LineSeriesOption } from 'echarts/types/dist/echarts';

;

type ChartData = {
  name: string;
  series: {
    name: string;
    value: number;
  }[];
};

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
  getNewDataInterval: NodeJS.Timeout | undefined;

  updateOptions: EChartsOption = {};

  private oneDay = 24 * 3600 * 1000;
  private now!: Date;
  private value!: number;
  private data: DataT[] = [];
  private timer!: any;

  options: EChartsOption = {
    title: {
      text: 'Dynamic Data + Time Axis'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Mocking Data',
        type: 'line',
        showSymbol: false,
        data: this.data
      }
    ]
  };

  private chartData: LineSeriesOption[] = [];

  constructor(private readonly websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    // generate some random testing data:
    this.getNewDataInterval = setInterval(async () => {
      const estimatedPowerData = await this.websocketService.getPowerDrawEstimateData();

     this.transformDataForChart(estimatedPowerData);
     this.options.series = this.chartData;
    }, 1000);

    this.data = [];
    this.now = new Date(1997, 9, 3);
    this.value = Math.random() * 1000;

    for (let i = 0; i < 1000; i++) {
      this.data.push(this.randomData());
    }

    // initialize chart options:

    // Mock dynamic data:
    this.timer = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        this.data.shift();
        this.data.push(this.randomData());
      }

      // update series data:
      this.updateOptions = {
        series: [
          {
            data: this.data
          }
        ]
      };
    }, 1000);
  }


  randomData(): DataT {
    this.now = new Date(this.now.getTime() + this.oneDay);
    this.value = this.value + Math.random() * 21 - 10;
    return {
      name: this.now.toString(),
      value: [
        [this.now.getFullYear(), this.now.getMonth() + 1, this.now.getDate()].join('/'),
        Math.round(this.value)
      ]
    };
  }

  /**
   * Transforms the raw data into a format suitable for the chart.
   *
   * This method takes a Record of string and number pairs, where the string represents the device name and the number represents the power draw.
   * It then transforms this data into an array of ChartData objects, where each object represents a device and its power draw over time.
   * Each ChartData object has a `name` property (the device name) and a `series` property (an array of objects representing the power draw at different times).
   *
   * If a device already exists in the chart data, the method adds a new power draw value to its series array. If the series array already has 30 elements, it removes the oldest one before adding the new value.
   * If a device does not exist in the chart data, the method adds a new ChartData object for it.
   *
   * Finally, the method replaces the `chartData` property of the component with the new array of ChartData objects. This triggers Angular's change detection and updates the chart.
   *
   * @param rawData - A Record of string and number pairs representing the estimated power draw of each device.
   */
  transformDataForChart(rawData: Record<string, number>): void {
    const newChartData = [...this.chartData];
  /*  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    Object.entries(rawData).forEach(([key, value]) => {
      const existingDeviceInData = newChartData.find(device => device.name === key);

      if (existingDeviceInData) {
        // We only store at maximum 30 values in the series array, which represents the last 30 seconds since we poll every second
        if (existingDeviceInData.series.length >= 30) {
          existingDeviceInData.series.shift(); // Remove the first element
        }
        existingDeviceInData.series.push({ name: timestamp, value: value });
      } else {
        newChartData.push({ name: key, series: [{ name: timestamp, value: value }] });
      }
    });
*/
    this.chartData = newChartData;
  }

  ngOnDestroy(): void {
    clearInterval(this.getNewDataInterval);
  }
}

type DataT = {
  name: string;
  value: [string, number];
};
