import {Injectable} from '@nestjs/common';
import {DatabaseConnection} from '../database/DatabaseConnection';
import {environment} from '../../../environments/environment';

@Injectable()
export class ModeStatisticsDbService extends DatabaseConnection {
  /**
   * When a mode is changed, this function is called.
   * It first updates the mode statistics for the previous mode. It sets the endedAt date time to the current date time.
   * Then it creates a new row for the newly selected mode.
   * @param {number} mode
   */
  async registerModeChange(mode: number) {
    // todo: Disable in production for now, because prisma can't connect to postgres in Docker.. :(
    if (!environment.statistics) return
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
