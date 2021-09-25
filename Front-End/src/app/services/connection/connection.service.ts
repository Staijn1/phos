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
        this.websocketService.setColor(colors)
    }

    /**
     * Sends data to show on visualizer mode
     * @param {number} amount - Integer ranging from 0 - 255
     */
    setLeds(amount: number): void {
        this.websocketService.setLeds(amount)
    }

    /**
     * Set the ledstrip to a certain mode
     * @param {number} mode - The ID of the mode to select
     */
    setMode(mode: number): void {
        this.apiService.setMode(mode)
    }

    /**
     * Retrieve all the different modes from the server
     * @return {Promise<ModeInformation[]>}
     */
    async getModes(): Promise<ModeInformation[]> {
        return this.apiService.getModes()
    }

    /**
     * Retrieve all the different gradients from the server. Gradients are used in the audiomotion visualizer
     * @return {Promise<GradientInformation[]>}
     */
    async getGradients(): Promise<GradientInformation[]> {
        return this.apiService.getGradients()
    }

    /**
     * Edit a gradient
     * @param {GradientInformationExtended} gradient - The gradient to edit with its new values
     * @return {Promise<void>}
     */
    async editGradient(gradient: GradientInformationExtended): Promise<void> {
        return this.apiService.editGradient(gradient)
    }

    /***
     * Delete a gradient
     * @param {GradientInformationExtended} gradient
     * @return {Promise<GradientInformation[]>}
     */
    async removeGradient(gradient: GradientInformationExtended): Promise<GradientInformation[]> {
        return this.apiService.removeGradient(gradient as GradientInformation)
    }

    /**
     * Create a new gradient
     * @param {GradientInformationExtended} newGradient
     * @return {Promise<GradientInformation[]>}
     */
    async addGradient(newGradient: GradientInformationExtended) :Promise<GradientInformation[]>{
        return this.apiService.addGradient(newGradient as GradientInformation)
    }
}
