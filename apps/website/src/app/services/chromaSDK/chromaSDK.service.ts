import {Injectable} from '@angular/core'
import {SettingsService} from '../settings/settings.service'

// BGR
@Injectable({
  providedIn: 'root'
})
export class ChromaSDKService {
  readonly API_PORT = 54235;
  readonly API_URL = `http://localhost:${this.API_PORT}/razer/chromasdk/`;

  readonly mouse = {
    rows: 9,
    columns: 7,
  };

  readonly keyboard = {
    rows: 6,
    columns: 22,
  };

  readonly headset = {
    amount: 5,
  };

  mouseColors = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  keyboardColors = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  private readonly options = {
    title: 'Razer Chroma implemented with WS2812B ledstrip in Electron!',
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
  private timerId!: NodeJS.Timeout;

  constructor(private settingsService: SettingsService) {
    if (this.isChromaSupport()) {
      this.init()
        .then((init) => {
          this.initializedApiURL = init.uri
        })
        .catch((err) => {
          console.log('Error! ', err)
        })
    }
  }

  private initializedApiURL: string | undefined;

  set setInitializedApiURL(newApiUrl: string) {
    this.initializedApiURL = newApiUrl
  }

  public async init(): Promise<any> {
    const response = await fetch(`${this.API_URL}/`, {
      method: 'POST',
      body: JSON.stringify(this.options),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })

    const data = response.json()
    if (response.ok) {
      this.timerId = setInterval(() => {
        this.onTimer()
      }, 5000)
    }
    return data
  }

  onTimer(): void {
    this.heartbeat().catch(err => {
      this.uninit()
    })
  }

  async heartbeat(): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null || !this.isChromaSupport()) {
      return
    }
    return fetch(`${this.initializedApiURL}/heartbeat`, {
      method: 'OPTIONS',
      body: null,
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
  }

  async createKeyboardEffect(effect: string, data: any): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
      return
    }
    let jsonObj

    if (effect === 'CHROMA_NONE') {
      jsonObj = JSON.stringify({effect})
    } else if (effect === 'CHROMA_CUSTOM') {
      jsonObj = JSON.stringify({effect, param: data})
    } else if (effect === 'CHROMA_STATIC') {
      const color = {color: data}
      jsonObj = JSON.stringify({effect, param: color})
    } else if (effect === 'CHROMA_CUSTOM_KEY') {
      jsonObj = JSON.stringify({effect, param: data})
    }

    const response = await fetch(`${this.initializedApiURL}/keyboard`, {
      method: 'PUT',
      body: jsonObj,
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })

    if (!response.ok) {
      throw new Error('error! ' + response.status)
    }
    return response.json()
  }

  async createMouseEffect(effect: string, data: any): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
      return
    }
    let jsonObj

    if (effect === 'CHROMA_NONE') {
      jsonObj = JSON.stringify({effect})
    } else if (effect === 'CHROMA_CUSTOM2') {
      jsonObj = JSON.stringify({effect, param: data})
    } else if (effect === 'CHROMA_STATIC') {
      const color = {color: data}
      jsonObj = JSON.stringify({effect, param: color})
    }

    const response = await fetch(`${this.initializedApiURL}/mouse`, {
      method: 'PUT',
      body: jsonObj,
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })

    if (!response.ok) {
      throw new Error('error! ' + response.status)
    }
    return response.json()
  }

  async setEffect(id: any): Promise<any> {
    const jsonObj = JSON.stringify({id})

    const response = await fetch(`${this.initializedApiURL}/effect`, {
      method: 'PUT',
      body: jsonObj,
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })

    if (!response.ok) {
      throw new Error('error! ' + response.status)
    }
    return response.json()
  }

  async createHeadsetEffect(effect: string, data: any): Promise<any> {
    if (this.initializedApiURL === undefined || this.initializedApiURL === null) {
      return
    }
    let jsonObj

    if (effect === 'CHROMA_NONE') {
      jsonObj = JSON.stringify({effect})
    } else if (effect === 'CHROMA_CUSTOM') {
      jsonObj = JSON.stringify({effect, param: data})
    } else if (effect === 'CHROMA_STATIC') {
      const color = {color: data}
      jsonObj = JSON.stringify({effect, param: color})
    } else if (effect === 'CHROMA_CUSTOM_KEY') {
      jsonObj = JSON.stringify({effect, param: data})
    }

    const response = await fetch(`${this.initializedApiURL}/headset`, {
      method: 'PUT',
      body: jsonObj,
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })

    if (!response.ok) {
      throw new Error('error! ' + response.status)
    }
    return response.json()
  }

  uninit(): void {
    this.initializedApiURL = undefined
    throw new Error('Not implemented!')
  }

  private isChromaSupport(): boolean {
    return this.settingsService.readGeneralSettings().chroma || false
  }
}
