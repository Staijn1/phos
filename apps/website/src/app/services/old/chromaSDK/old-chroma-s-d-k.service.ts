import { Injectable } from '@angular/core';
import { MessageService } from '../../message-service/message.service';
import { Store } from '@ngrx/store';
import { UserPreferences } from '../../../shared/types/types';
import { distinctUntilChanged, map } from 'rxjs';

export enum ChromaKeyboardEffectType {
  CHROMA_CUSTOM_KEY = 'CHROMA_CUSTOM_KEY',
  CHROMA_STATIC = 'CHROMA_STATIC',
  CHROMA_CUSTOM = 'CHROMA_CUSTOM',
  CHROMA_NONE = 'CHROMA_NONE',
}

export enum ChromaHeadsetEffectType {
  CHROMA_CUSTOM_KEY = 'CHROMA_CUSTOM_KEY',
  CHROMA_STATIC = 'CHROMA_STATIC',
  CHROMA_CUSTOM = 'CHROMA_CUSTOM',
  CHROMA_NONE = 'CHROMA_NONE',
}

export enum ChromaMouseEffectType {
  CHROMA_NONE = 'CHROMA_NONE',
  CHROMA_CUSTOM2 = 'CHROMA_CUSTOM2',
  CHROMA_STATIC = 'CHROMA_STATIC',
}

/**
 * This class contains the necessary methods to register this application with the Razer SDK and to keep the connection alive (or destroy it)
 * All colors sent to the Razer API must first be converted to BGR format instead of RGB
 * @deprecated
 */
@Injectable({
  providedIn: 'root'
})
export class OldChromaSDKService {
  mouseColors = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];
  keyboardColors = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  readonly mouse = {
    rows: this.mouseColors.length,
    columns: this.mouseColors[0].length
  };
  readonly keyboard = {
    rows: this.keyboardColors.length,
    columns: this.keyboardColors[0].length
  };
  readonly headset = {
    amount: 5
  };
  private readonly RAZER_API_PORT = 54235;
  private readonly API_URL = `http://localhost:${this.RAZER_API_PORT}/razer/chromasdk/`;
  private readonly options = {
    title: 'Angulon',
    description: 'The ledstrip and Razer peripherals will share some effects, controlled through a nice UI.',
    author: {
      name: 'Stein Jonker',
      contact: 'null'
    },
    device_supported: [
      'keyboard',
      'mouse',
      'headset',
      'mousepad',
      'keypad',
      'chromalink'
    ],
    category: 'application'
  };
  private heartbeatTimerId!: NodeJS.Timeout;
  private initializedApiURL: string | undefined;

  constructor(private messageService: MessageService, private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
    this.store.select('userPreferences').pipe(
      map(({ settings }) => settings.chromaSupportEnabled),
      distinctUntilChanged()
    ).subscribe((isChromaSupportEnabled) => {
      if (isChromaSupportEnabled) {
        this.init()
          .then((init) => this.initializedApiURL = init.uri)
          .catch((err) => this.messageService.setMessage(err));
      } else {
        this.uninit();
      }
    });
  }

  /**
   * Registers the application with the Razer SDK, and starts the heartbeat beating
   */
  public async init(): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/`, {
        method: 'POST',
        body: JSON.stringify(this.options),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });

      const data = response.json();
      if (response.ok) {
        this.heartbeatTimerId = setInterval(() => {
          this.onTimer();
        }, 5000);
      }
      return data;
    } catch (e) {
      throw new Error('Failed to setup the connection with the Razer SDK. Is Razer Synapse installed & running?');
    }
  }

  /**
   * This function is called every so often to keep the connection with the Razer API alive
   */
  onTimer(): void {
    this.heartbeat().catch(err => {
      this.messageService.setMessage(err);
      this.uninit();
    });
  }

  heartbeat(): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
      return Promise.resolve(undefined);
    }
    return fetch(`${this.initializedApiURL}/heartbeat`, {
      method: 'OPTIONS',
      body: null,
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });
  }

  async createKeyboardEffect(effect: ChromaKeyboardEffectType, data: any): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
      return;
    }
    let jsonObj;

    if (effect === 'CHROMA_NONE') {
      jsonObj = JSON.stringify({ effect });
    } else if (effect === 'CHROMA_CUSTOM') {
      jsonObj = JSON.stringify({ effect, param: data });
    } else if (effect === 'CHROMA_STATIC') {
      const color = { color: data };
      jsonObj = JSON.stringify({ effect, param: color });
    } else if (effect === 'CHROMA_CUSTOM_KEY') {
      jsonObj = JSON.stringify({ effect, param: data });
    }

    const response = await fetch(`${this.initializedApiURL}/keyboard`, {
      method: 'PUT',
      body: jsonObj,
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });

    if (!response.ok) {
      throw new Error('error! ' + response.status);
    }
    return response.json();
  }

  async createMouseEffect(effect: ChromaMouseEffectType, data: any): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
      return;
    }
    let jsonObj;

    if (effect === 'CHROMA_NONE') {
      jsonObj = JSON.stringify({ effect });
    } else if (effect === 'CHROMA_CUSTOM2') {
      jsonObj = JSON.stringify({ effect, param: data });
    } else if (effect === 'CHROMA_STATIC') {
      const color = { color: data };
      jsonObj = JSON.stringify({ effect, param: color });
    }

    const response = await fetch(`${this.initializedApiURL}/mouse`, {
      method: 'PUT',
      body: jsonObj,
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });

    if (!response.ok) {
      throw new Error('error! ' + response.status);
    }
    return response.json();
  }

  async createHeadsetEffect(effect: ChromaHeadsetEffectType, data: any): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
      return;
    }
    let jsonObj;

    if (effect === 'CHROMA_NONE') {
      jsonObj = JSON.stringify({ effect });
    } else if (effect === 'CHROMA_CUSTOM') {
      jsonObj = JSON.stringify({ effect, param: data });
    } else if (effect === 'CHROMA_STATIC') {
      const color = { color: data };
      jsonObj = JSON.stringify({ effect, param: color });
    } else if (effect === 'CHROMA_CUSTOM_KEY') {
      jsonObj = JSON.stringify({ effect, param: data });
    }

    const response = await fetch(`${this.initializedApiURL}/headset`, {
      method: 'PUT',
      body: jsonObj,
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });

    if (!response.ok) {
      throw new Error('error! ' + response.status);
    }
    return response.json();
  }

  uninit(): void {
    this.initializedApiURL = undefined;
    clearInterval(this.heartbeatTimerId);
  }
}
