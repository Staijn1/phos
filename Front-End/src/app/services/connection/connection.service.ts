import {Injectable} from '@angular/core'
import {Connection} from '../../shared/interfaces/Connection'
import {WebsocketService} from '../websocketconnection/websocket.service'
import {HTTPConnectionService} from '../httpconnection/httpconnection.service'
import {ModeInformation} from '../../shared/types/ModeInformation'
import {GradientInformation, GradientInformationExtended} from '../../shared/types/GradientInformation'
import iro from '@jaames/iro'

@Injectable({
    providedIn: 'root'
})
export class ConnectionService extends Connection {

    constructor(private websocketService: WebsocketService, private apiService: HTTPConnectionService) {
        super()
    }

    decreaseBrightness(): void {
        this.apiService.decreaseBrightness()
    }

    decreaseSpeed(): void {
        this.apiService.decreaseSpeed()
    }

    increaseBrightness(): void {
        this.apiService.increaseBrightness()
    }

    increaseSpeed(): void {
        this.apiService.increaseSpeed()
    }

    protected send(command: string): void {
        throw Error('Not implemented')
    }

    setColor(colors: iro.Color[] | string[]): void {
        this.apiService.setColor(colors)
    }

    setLeds(amount: number): void {
        this.websocketService.setLeds(amount)
    }

    setMode(mode: number): void {
        this.websocketService.setMode(mode)
    }

    async getModes(): Promise<ModeInformation[]> {
        return this.apiService.getModes()
    }

    async getGradients(): Promise<GradientInformation[]> {
        return this.apiService.getGradients()
    }

    async editGradient(gradient: GradientInformationExtended): Promise<void> {
        return this.apiService.editGradient(gradient)
    }

    async removeGradient(gradient: GradientInformationExtended): Promise<GradientInformation[]> {
        return this.apiService.removeGradient(gradient as GradientInformation)
    }

    async addGradient(newGradient: GradientInformationExtended) :Promise<GradientInformation[]>{
        return this.apiService.addGradient(newGradient as GradientInformation)
    }
}
