import { Injectable, Logger } from "@nestjs/common";
import { NetworkState } from "@angulon/interfaces";

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  getNetworkState(): NetworkState {
    this.logger.warn("getNetworkState not implemented");
    return {
      rooms: []
    }
  }

  createRoom(roomName: string) {
    this.logger.warn("createRoom not implemented");
  }

  deleteRoom(roomName: string) {
    this.logger.warn("deleteRoom not implemented");
  }

  addDeviceToRoom(roomName: string, macAddress: string) {
    this.logger.warn("addDeviceToRoom not implemented");
  }

  removeDeviceFromRoom(roomName: string, macAddress: string) {
    this.logger.warn("removeDeviceFromRoom not implemented");
  }
}
