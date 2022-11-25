import {Injectable} from '@nestjs/common';
import {DatabaseConnection} from '../database/DatabaseConnection';

@Injectable()
export class ModeStatisticsDbService extends DatabaseConnection {
  /**
   * When a mode is changed, this function is called.
   * It first updates the mode statistics for the previous mode. It sets the endedAt date time to the current date time.
   * Then it creates a new row for the newly selected mode.
   * @param {number} mode
   */
  async registerModeChange(mode: number) {
    this.connect();

    await this.client.modeStatistics.updateMany({
      where: {
        disabledAt: null
      },
      data: {
        disabledAt: new Date(),
      },
    });

    await this.client.modeStatistics.create({
      data: {
        disabledAt: null,
        modeId: mode
      }
    });

    await this.disconnect();
  }
}
