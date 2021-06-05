import {State} from '../abstract/state';
import {iroColorObject} from '../../../../shared/types/types';
import {calculateBGRInteger, map, qadd8, qsub8, randomInteger, WarmColor} from '../../../../shared/functions';

export class Fire2012State extends State {
    private interval: NodeJS.Timeout;
    readonly COOLING = 55;
    readonly SPARKING = 120;
    private G_REVERSE_DIRECTION = false;
    private heatKeyboard: number[];
    private heatMouse: number[];

    constructor() {
        super();
    }

    handle(colors: iroColorObject[]): void {
        if (this.interval === undefined) {
            this.interval = setInterval(() => {
                this.fire2012Keyboard();
                this.fire2012Mouse();

                const headsetColors = this._context.keyboardColors[0].splice(0, this._context.headset.amount);
                this._context.createHeadsetEffect('CHROMA_CUSTOM', headsetColors);
            }, this._context.speed / this._context.keyboard.columns);
        }
    }

    onEntry(): void {
        // Array of temperature readings at each simulation cell
        this.heatKeyboard = [];
        for (let i = 0; i < this._context.keyboard.columns; i++) {
            this.heatKeyboard[i] = 0;
        }

        this.heatMouse = [];
        for (let i = 0; i < this._context.mouse.rows; i++) {
            this.heatMouse[i] = 0;
        }
    }

    onExit(): void {
        clearInterval(this.interval);
    }

    // Fire2012 by Mark Kriegsman, July 2012
    // as part of "Five Elements" shown here: http://youtu.be/knWiGsmgycY
    // This basic one-dimensional 'fire' simulation works roughly as follows:
    // There's a underlying array of 'heatKeyboard' cells, that model the temperature
    // at each point along the line.  Every cycle through the simulation,
    // four steps are performed:
    //  1) All cells cool down a little bit, losing heatKeyboard to the air
    //  2) The heatKeyboard from each cell drifts 'up' and diffuses a little
    //  3) Sometimes randomly new 'sparks' of heatKeyboard are added at the bottom
    //  4) The heatKeyboard from each cell is rendered as a color into the leds array
    //     The heatKeyboard-to-color mapping uses a black-body radiation approximation.
    //
    // Temperature is in arbitrary units from 0 (cold black) to 255 (white hot).
    //
    // This simulation scales it self a bit depending on LED_COUNT; it should look
    // "OK" on anywhere from 20 to 100 LEDs without too much tweaking.
    //
    // I recommend running this simulation at anywhere from 30-100 frames per second,
    // meaning an interframe delay of about 10-35 milliseconds.
    //
    // Looks best on a high-density LED setup (60+ pixels/meter).
    //
    //
    // There are two main parameters you can play with to control the look and
    // feel of your fire: COOLING (used in step 1 above), and SPARKING (used
    // in step 3 above).
    //
    // COOLING: How much does the air cool as it rises?
    // Less cooling = taller flames.  More cooling = shorter flames.
    // Default 50, suggested range 20-100

    // SPARKING: What chance (out of 255) is there that a new spark will be lit?
    // Higher chance = more roaring fire.  Lower chance = more flickery fire.
    // Default 120, suggested range 50-200.
    private fire2012Keyboard(): void {
        this.coolDown(this.heatKeyboard, this._context.keyboard.columns);
        this.driftUp(this.heatKeyboard, this._context.keyboard.columns);

        this.ignite(this.heatKeyboard, this._context.keyboard.columns, 7);

        // Step 4.  Map from heatKeyboard cells to LED colors on keyboard
        for (let i = 0; i < this._context.keyboard.rows; i++) {
            for (let j = 0; j < this._context.keyboard.columns; j++) {
                const color = WarmColor(map(this.heatKeyboard[j], 0, 255, 0, 240));
                let pixelnumber;
                if (this.G_REVERSE_DIRECTION) {
                    pixelnumber = (this._context.keyboard.columns - 1) - j;
                } else {
                    pixelnumber = j;
                }

                // **** modified for use with WS2812FX ****
                //    leds[pixelnumber] = color;
                // ws2812fx.setPixelColor(pixelnumber, color.red, color.green, color.blue);
                // console.log(typeof color.red);
                this._context.keyboardColors[i][pixelnumber] = calculateBGRInteger(color.r, color.g, color.b);
                // **** modified for use with WS2812FX ****
            }
        }

        this._context.createKeyboardEffect('CHROMA_CUSTOM', this._context.keyboardColors).then();
    }

    private fire2012Mouse(): void {
        this.coolDown(this.heatMouse, this._context.mouse.rows);
        this.driftUp(this.heatMouse, this._context.mouse.rows);

        this.ignite(this.heatMouse, this._context.mouse.rows, 1);
        // Step 4.  Map from heatKeyboard cells to LED colors on keyboard
        for (let i = 0; i < this._context.mouse.rows; i++) {
            for (let j = 0; j < this._context.mouse.columns; j++) {
                const color = WarmColor(map(this.heatMouse[i], 0, 255, 0, 240));
                let pixelnumber;
                if (this.G_REVERSE_DIRECTION) {
                    pixelnumber = (this._context.mouse.rows - 1) - i;
                } else {
                    pixelnumber = i;
                }

                this._context.mouseColors[pixelnumber][j] = calculateBGRInteger(color.r, color.g, color.b);
            }
        }

        this._context.createMouseEffect('CHROMA_CUSTOM2', this._context.mouseColors).then();
    }

    private ignite(arrayToManipulate: number[], maxLeds: number, bottom: number): void {
        // Step 3.  Randomly ignite new 'sparks' of heat near the bottom
        if (randomInteger(0, 255) < this.SPARKING) {
            const y = randomInteger(0, bottom);
            arrayToManipulate[y] = qadd8(arrayToManipulate[y], randomInteger(160, 255));
        }
    }

    private coolDown(arrayToManipulate: number[], maxLeds: number): void {
        // Step 1.  Cool down every cell a little
        for (let i = 0; i < maxLeds; i++) {
            arrayToManipulate[i] = qsub8(arrayToManipulate[i], randomInteger(0, ((this.COOLING * 10) / maxLeds) + 2));
        }
    }

    private driftUp(arrayToManipulate: number[], maxLeds: number): void {
        // Step 2.  Heat from each cell drifts 'up' and diffuses a little
        for (let k = maxLeds - 1; k >= 2; k--) {
            arrayToManipulate[k] = (arrayToManipulate[k - 1] + arrayToManipulate[k - 2] + arrayToManipulate[k - 2]) / 3;
        }
    }
}
