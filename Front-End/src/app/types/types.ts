export type iroColorObject = {
    alpha: number;
    blue: number;
    green: number;
    hex8String: string;
    hexString: string;
    hsl: hslObject;
    hslString: string;
    hsla: hslaObject;
    hslaString: string;
    hsv: hsvObject;
    hsva: hsvaObject;
    hue: number;
    kelvin: number;
    red: number,
    rgb: rgbObject;
    rgbString: string;
    rgba: rgbaObject;
    rgbaString: string;
    saturation: number;
    value: number;
};

export type hslObject = {
    h: number;
    l: number;
    s: number;
};

export type hslaObject = {
    a: number;
    h: number;
    l: number;
    s: number;
};

export type hsvObject = {
    h: number;
    s: number;
    v: number;
};

export type hsvaObject = {
    a: number;
    h: number;
    s: number;
    v: number;
};

export type rgbObject = {
    r: number;
    g: number;
    b: number;
};

export type rgbaObject = {
    a: number;
    r: number;
    g: number;
    b: number;
};

export type GeneralSettings = {
    colors: string[],
    chroma: boolean
};
