import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocketconnection/websocket.service';

@Component({
  selector: 'app-power-draw',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './power-draw.component.html',
  styleUrls: ['./power-draw.component.scss']
})
export class PowerDrawComponent implements OnInit, OnDestroy {
  getNewDataInterval: NodeJS.Timeout | undefined;

  estimatedPowerDataHistory: { time: Date, data: Map<string, number> }[] = [];

  constructor(private readonly websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.getNewDataInterval = setInterval(async () => {
      const estimatedPowerData = await this.websocketService.getPowerDrawEstimateData();

      this.estimatedPowerDataHistory.push({ time: new Date(), data: estimatedPowerData });
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.getNewDataInterval);
  }
}
