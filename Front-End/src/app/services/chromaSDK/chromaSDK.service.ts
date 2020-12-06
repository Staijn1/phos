import {Injectable} from '@angular/core';

// BGR
@Injectable({
    providedIn: 'root'
})
export class ChromaSDKService {
    readonly API_PORT = 54235;
    readonly API_URL = `http://localhost:${this.API_PORT}/razer/chromasdk/`;
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
    private timerId: NodeJS.Timeout;

    constructor() {
        this.init()
            .then((init) => {
                this.initializedApiURL = init.uri;
            })
            .catch((err) => {
                console.log('Error! ', err);
            });
    }

    private initializedApiURL;

    set setInitializedApiURL(newApiUrl: string) {
        this.initializedApiURL = newApiUrl;
    }

    public async init(): Promise<any> {
        const response = await fetch(`${this.API_URL}/`, {
            method: 'POST',
            body: JSON.stringify(this.options),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });

        const data = response.json();
        if (response.ok) {
            this.timerId = setInterval(() => {
                this.onTimer();
            }, 5000);
        }
        return data;
    }

    onTimer(): void {
        this.heartbeat().catch(err => {
            this.uninit();
        });
    }

    async heartbeat(): Promise<any> {
        return await fetch(`${this.initializedApiURL}/heartbeat`, {
            method: 'OPTIONS',
            body: null,
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });
    }

    async createKeyboardEffect(effect, data): Promise<any> {
        let jsonObj;

        if (effect === 'CHROMA_NONE') {
            jsonObj = JSON.stringify({effect});
        } else if (effect === 'CHROMA_CUSTOM') {
            jsonObj = JSON.stringify({effect, param: data});
        } else if (effect === 'CHROMA_STATIC') {
            const color = {color: data};
            jsonObj = JSON.stringify({effect, param: color});
        } else if (effect === 'CHROMA_CUSTOM_KEY') {
            jsonObj = JSON.stringify({effect, param: data});
        }

        const response = await fetch(`${this.initializedApiURL}/keyboard`, {
            method: 'PUT',
            body: jsonObj,
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });

        if (!response.ok) {
            throw new Error('error! ' + response.status);
        }
        return await response.json();
    }

    async createMouseEffect(effect, data): Promise<any> {
        let jsonObj;

        if (effect === 'CHROMA_NONE') {
            jsonObj = JSON.stringify({effect});
        } else if (effect === 'CHROMA_CUSTOM2') {
            jsonObj = JSON.stringify({effect, param: data});
        } else if (effect === 'CHROMA_STATIC') {
            const color = {color: data};
            jsonObj = JSON.stringify({effect, param: color});
        }

        const response = await fetch(`${this.initializedApiURL}/mouse`, {
            method: 'PUT',
            body: jsonObj,
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });

        if (!response.ok) {
            throw new Error('error! ' + response.status);
        }
        return await response.json();
    }

    async setEffect(id: any): Promise<any> {
        const jsonObj = JSON.stringify({id});

        const response = await fetch(`${this.initializedApiURL}/effect`, {
            method: 'PUT',
            body: jsonObj,
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });

        if (!response.ok) {
            throw new Error('error! ' + response.status);
        }
        return response.json();
    }

    private uninit(): void {
        console.log('err');
    }

    async createHeadsetEffect(effect, data): Promise<any> {
        let jsonObj;

        if (effect === 'CHROMA_NONE') {
            jsonObj = JSON.stringify({effect});
        } else if (effect === 'CHROMA_CUSTOM') {
            jsonObj = JSON.stringify({effect, param: data});
        } else if (effect === 'CHROMA_STATIC') {
            const color = {color: data};
            jsonObj = JSON.stringify({effect, param: color});
        } else if (effect === 'CHROMA_CUSTOM_KEY') {
            jsonObj = JSON.stringify({effect, param: data});
        }

        const response = await fetch(`${this.initializedApiURL}/headset`, {
            method: 'PUT',
            body: jsonObj,
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        });

        if (!response.ok) {
            throw new Error('error! ' + response.status);
        }
        return await response.json();
    }
}
