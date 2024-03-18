import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxEchartsDirective, provideEcharts} from 'ngx-echarts';
import {ECElementEvent, EChartsOption, LineSeriesOption} from 'echarts';
import {WebsocketService} from '../../../services/websocketconnection/websocket.service';
import {extractThemeColorsFromDOM} from '../../functions';
import {OptionDataValue} from 'echarts/types/src/util/types';

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
export class PowerDrawComponent implements OnDestroy {
  chartOption: EChartsOption = {
    title: {
      text: 'Power Draw Estimate per Device (Watts)',
      textStyle: {
        fontFamily: 'Comfortaa, sans-serif',
        color: extractThemeColorsFromDOM()?.baseContent ?? 'black'
      }
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: OptionDataValue | OptionDataValue[]) => {
        if (Array.isArray(value) || typeof value !== 'number') {
         return 'Value in tooltip value formatter is not of correct type. This should not happen, expecting a number';
        }

        return `${Math.round(value)}W`;
      },
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis: {
      boundaryGap: [0, '50%'],
      type: 'value',
      splitLine: {
        show: false
      }
    },
    series: [],
    legend: {
      textStyle: {
        color: extractThemeColorsFromDOM()?.baseContent ?? 'black'
      },
      bottom: 0,
    }
  };

  updateOptions!: EChartsOption;
  data: SingleSeriesData[] = [];
  timestamps: string[] = [];
  private getDataInterval: NodeJS.Timeout | undefined;
  private MAXIMUM_DATA_POINTS = 30;
  private POLLING_INTERVAL_MS = 1000;

  constructor(private readonly websocketService: WebsocketService) {
  }

  public startPollingData() {
    this.getDataInterval = setInterval(async () => {
      const powerEstimates = await this.websocketService.getPowerDrawEstimateData();

      this.updateChart(powerEstimates);
    }, this.POLLING_INTERVAL_MS);
  }


  /**
   * Updates the chart with new power estimates.
   *
   * This method is responsible for updating the chart with new power estimates.
   * It first gets the current time and adds it to the timestamps array. Then, it iterates over each device we received the power estimates for.
   * For each power estimate, it checks if there is an existing series for the corresponding device.
   *
   * If there is, it adds the new data point to the existing series.
   * If not, it creates a new series for the device.
   *
   * When the amount of data points in the existing series exceeds 30, it removes the oldest data point to keep the chart updated with the most recent data.
   *
   * @param  powerEstimates - An object where the keys are device names and the values are the corresponding power estimates.
   */
  private updateChart(powerEstimates: Record<string, number>) {
    const nowString = new Date().toLocaleTimeString('en-US', {hour12: false});

    if (this.timestamps.length >= this.MAXIMUM_DATA_POINTS) this.timestamps.shift();
    this.timestamps.push(nowString);


    const series: LineSeriesOption[] = [];

    Object.entries(powerEstimates).forEach(([deviceName, powerEstimate]) => {
      const existingSeries = (this.chartOption.series as LineSeriesOption[]).find(s => s.name === deviceName);
      const datapoint = {category: nowString, value: powerEstimate};

      // If there is an existing series for this device, add the new data point to it
      if (existingSeries) {
        const existingSeriesData = existingSeries.data as SingleSeriesData[];

        // Remove oldest data point if we have more than 30 data points
        if (existingSeriesData.length >= this.MAXIMUM_DATA_POINTS) {
          existingSeriesData.shift();
        }

        existingSeriesData.push(datapoint);
        existingSeries.data = existingSeriesData;

        series.push(existingSeries);
      } else {
        series.push({
          name: deviceName,
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [datapoint]
        });

        // Update the chart option to make sure the lookup will be successful next time
        this.chartOption.series = series;
      }
    });

    // Merge new data into chart options
    this.updateOptions = {
      xAxis: {
        data: this.timestamps
      },
      series: series
    };
  }

  ngOnDestroy() {
    this.stopPollingData();
  }

  stopPollingData() {
    clearInterval(this.getDataInterval);
  }
}


export type SingleSeriesData = {
  category: string;
  value: number;
}
