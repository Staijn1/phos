import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocketconnection/websocket.service';
import { Color, LineChartModule, ScaleType } from '@swimlane/ngx-charts';

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
  imports: [CommonModule, LineChartModule],
  templateUrl: './power-draw.component.html',
  styleUrls: ['./power-draw.component.scss']
})
export class PowerDrawComponent implements OnInit, OnDestroy {
  getNewDataInterval: NodeJS.Timeout | undefined;

  chartData: ChartData[] = [];
  colorscheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private readonly websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.getNewDataInterval = setInterval(async () => {
      const estimatedPowerData = await this.websocketService.getPowerDrawEstimateData();

     this.transformDataForChart(estimatedPowerData);
    }, 1000);
  }


  transformDataForChart(rawData: Record<string, number>): void {
    const newChartData: ChartData[] = [...this.chartData];

    Object.entries(rawData).forEach(([key, value]) => {
      const existingDeviceInData = newChartData.find(device => device.name === key);

      if (existingDeviceInData) {
        existingDeviceInData.series = [...existingDeviceInData.series, { name: new Date().toISOString(), value: value }];
      } else {
        newChartData.push({ name: key, series: [{ name: new Date().toISOString(), value: value }] });
      }
    });

    this.chartData = newChartData;
  }

  ngOnDestroy(): void {
    clearInterval(this.getNewDataInterval);
  }
}
