class SolidRing {
    constructor(x, y, thickness, diameter, backgroundColor, color) {
        this.x = x;
        this.y = y;
        this.thickness = thickness;
        this.diameter = diameter;
        this.backgroundColor = backgroundColor;
        this.color = color;
    }

    draw() {
        strokeWeight(5)
        this.color.setAlpha(1)
        fill(this.color);
        this.color.setAlpha(0.5)
        stroke(this.color);
        ellipse(this.x, this.y, this.diameter, this.diameter);

        fill(this.backgroundColor);
        ellipse(this.x, this.y, this.diameter - this.thickness, this.diameter - this.thickness);
    }

    setDiameter(newDiameter) {
        this.diameter = newDiameter;
        return this;
    }

    setThickness(newThickness) {
        this.thickness = newThickness;
        return this;
    }

    setColor(newColor) {
        this.color = newColor;
        return this;
    }
}

class DottedRing {
    constructor(x, y, radius, N, color, diameterOfSmallCircle, speed) {
        this.radius = radius;
        this.da = TWO_PI / N;
        this.x = x;
        this.y = y;
        this.color = color;
        this.diameterOfSmallCircle = diameterOfSmallCircle;
        this.rotation = 0;
        this.speed = speed;
    }

    draw() {
        strokeWeight(4)
        push();
        this.color.setAlpha(1)
        fill(this.color);
        this.color.setAlpha(0.5)
        stroke(this.color);
        this.rotation += this.speed;
        rotate(this.rotation)
        for (let a = 0; a < TWO_PI; a += this.da) {
            ellipse(this.x + this.radius * cos(a), this.x + this.radius * sin(a), this.diameterOfSmallCircle, this.diameterOfSmallCircle);
        }
        pop();
    }

    setDa(newN) {
        this.da = TWO_PI / newN;
    }

    setSpeed(newSpeed) {
        this.speed = newSpeed;
        return this;
    }

    setDiameterOfSmallCircles(newDiameter) {
        this.diameterOfSmallCircle = newDiameter;
        return this;
    }

    setColor(newColor) {
        this.color = newColor;
        return this;
    }
}

class RectangleRing {
    rectangles = [];

    constructor(x, y, radius, amount, rotation, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.amount = amount;
        this.rotation = rotation;
        this.color = color;
        this.spacing = 360 / this.amount;
        for (let i = 0; i < this.amount; i++) {
            this.rectangles[i] = new RectangleForCircle(0 + this.radius, 0, this.rotation, this.color, 10, 10);
        }
    }

    draw() {
        strokeWeight(1)
        push();
        translate(this.x, this.y);

        for (var i = 0; i < this.amount; i++) {
            push();
            rotate(i * this.spacing);
            if (this.rectangles[i].getColor() != this.color) {
                this.rectangles[i].setColor(this.color);
            }
            this.rectangles[i].render();
            pop();
        }

        pop();
    }

    applyFFT(values) {
        for (let i = 0; i < this.amount; i++) {
            this.rectangles[i].setHeight(map(values[i], 0, 255, 5, 100));
        }
    }

    setColor(newColor) {
        this.color = newColor;
        return this;
    }
}

class RectangleForCircle {
    constructor(x, y, rot, color, width, height) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    render() {
        push();
        this.color.setAlpha(1)
        fill(this.color);
        translate(this.x, this.y);
        rotate(this.rot);
        rectMode(CORNER);
        rect(0, 0, this.height, this.width)
        pop();
    }

    setHeight(newHeight) {
        this.height = newHeight;
    }

    setColor(newColor) {
        this.color = newColor;
        return this;
    }

    getColor() {
        return this.color;
    }
}

class Dot {
    constructor(x, y, size, easing, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.easing = easing;
        this.targetY = 0;
        this.color = color;
        this.initColor = color;
        this.isSelected = false;
        this.initSize = size;
    }

    draw() {
        this.ease();

        this.handleSelected();

        fill(this.color)
        ellipse(this.x, this.y, this.size, this.size);
    }

    ease() {
        let dy = this.targetY - this.y;
        this.y += dy * this.easing;
    }

    setTargetY(targetY) {
        this.targetY = targetY;
        return this;
    }

    handleSelected() {
        if (this.isSelected) {
            this.color = colorPicker.color.hexString;
        } else {
            this.color = this.initColor;
        }
    }

    setSelected(value) {
        this.isSelected = value;
        return this;
    }

    setSize(size) {
        this.size = size;
        return this;
    }

    getSize() {
        return this.size;
    }

    getX() {
        return this.x;
    }
}

class Particle {
    velocity;
    speed;

    constructor(minSpeed, maxSpeed, color) {
        this.position = createVector(random(0, window.innerWidth), random(0, window.innerHeight));
        // this.velocity = createVector(random(-1, 1), random(-1, 1));
        // this.velocity.normalize();
        // this.velocity.mult(random(minSpeed, maxSpeed));
        this.velocity = p5.Vector.random2D();
        this.velocity.mult(speed);
        this.size = random(3, 10);
        this.initSize = this.size;
        this.color = color;
    }


    update() {
        this.position.add(this.velocity);
        if (this.position.x < 0) {
            this.position.x = this.size;
            this.velocity.x *= -1;
        }
        if (this.position.y < 0) {
            this.position.y = this.size;
            this.velocity.y *= -1;
        }
        if (this.position.x > width - this.size) {
            this.position.x = width - this.size;
            this.velocity.x *= -1;
        }
        if (this.position.y > height - this.size) {
            this.position.y = height - this.size;
            this.velocity.y *= -1;
        }
    }

    draw() {
        //point(this.position.x, this.position.y);
        push();
        fill(this.color);
        noStroke();
        ellipse(this.position.x, this.position.y, this.size, this.size);
        pop();
    };

    accelerate(){

    }
}

class Rectangle {
    constructor(x, y, width, height, rectColor, tl = 0, tr = 0, br = 0, bl = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rectColor = rectColor;
        this.tl = tl;
        this.tr = tr;
        this.br = br;
        this.bl = bl;
    }

    draw() {
        fill(this.rectColor);
        noStroke();
        rect(this.x, this.y, this.width, this.height, this.tl, this.tr, this.br, this.bl);
    }

    getHeight() {
        return this.height;
    }

    setHeight(height) {
        this.height = height;
        return this;
    }

    setWidth(width) {
        this.width = width;
        return this;
    }

    getWidth() {
        return this.width;
    }

    setColor(newColor) {
        this.color = newColor;
    }
}

class SelectableRectangle extends Rectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.initColor = color;
        this.isSelected = false;
    }

    draw() {
        this.handleSelected();
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }

    handleSelected() {
        if (this.isSelected) {
            this.color = colorPicker.color.hexString;
        } else {
            this.color = this.initColor;
        }
    }

    setSelected(value) {
        this.isSelected = value;
        return this;
    }
}

class Polygon {

    constructor(x, y, radius, npoints, color) {
        this.angle = TWO_PI / npoints;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        beginShape();
        fill(this.color);
        for (let a = 0; a < TWO_PI; a += this.angle) {
            let sx = this.x + cos(a) * this.radius;
            let sy = this.y + sin(a) * this.radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }
}

class Arc {
    constructor(x, y, diameter, rotation, color, thickness) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.rotation = rotation;
        this.start = 0;
        this.end = 359;
        this.thickness = thickness;
        this.color = color;
    }

    draw() {
        push();
        translate(width / 2, height / 2);
        angleMode(DEGREES);
        noFill();
        strokeWeight(this.thickness);
        stroke(this.color);
        rotate(this.rotation);
        arc(this.x, this.y, this.diameter, this.diameter, this.start, this.end);
        pop();
    }

    setEnd(newEnd) {
        this.end = newEnd;
    }

    setColor(newColor) {
        this.color = newColor;
    }
}

class Text {
    constructor(text, x, y, size, textColor, width, height, font = 'Arial') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.textColor = textColor;
        this.width = width;
        this.height = height;
        this.font = font;
    }

    draw() {
        push();
        textFont(this.font);
        textSize(this.size);
        fill(this.textColor);
        text(this.text, this.x, this.y, this.width, this.height);
        pop();
    }

    setText(newText) {
        this.text = newText;
        return this;
    }

    getText() {
        return this.text;
    }

    setColor(newColor) {
        this.textColor = newColor;
        return this;
    }
}

class Line {
    constructor(x1, y1, x2, y2, thickness, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.thickness = thickness;
        this.color = color;
    }

    draw() {
        strokeWeight(this.thickness);
        stroke(this.color)
        line(this.x1, this.y1, this.x2, this.y2)
    }


}

class Circle {
    x;
    y;
    size;
    easing;
    color;

    constructor(x, y, size, easing, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw() {
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
    }

    move() {

    }
}

class ProgressBar {
    constructor(x, y, width, height, progressBarColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = progressBarColor;
        this.progressWidth = 0;
    }

    draw() {
        fill(this.color);
        rect(this.x, this.y + this.height / 2, this.progressWidth, 20);
    }

    setProgressWidth(newWidth) {
        this.progressWidth = newWidth;
    }

    getWidth() {
        return this.width;
    }
}

class FFTProgram {
    allAverages = [];
    bass;
    lowMid;
    mid;
    highMid;
    treble;

    selectedBar;
    sound;
    fft;
    amountToShow;

    constructor(amountOfBins, percentageNotToShow) {
        this.amountOfBins = amountOfBins;

        const percentageToShow = (100 - percentageNotToShow) / 100;
        this.percentageNotToShow = percentageNotToShow;
        this.amountToShow = this.amountOfBins * percentageToShow;

        //Create mic input object.
        this.sound = new p5.AudioIn();
        //Start listening on mic.
        this.sound.start();
        //Create FFT object
        this.fft = new p5.FFT(0.85, this.amountOfBins);

        //Connect mic to fft
        this.sound.connect(this.fft);
        this.sound.amp(0.5);
        this.selectedBar = 1;
    }

    run() {
        this.fft.analyze();
        this.allAverages = this.fft.linAverages(this.amountOfBins);
        this.bass = this.fft.getEnergy("bass");
        this.lowMid = this.fft.getEnergy("lowMid");
        this.mid = this.fft.getEnergy("mid");
        this.highMid = this.fft.getEnergy("highMid");
        this.treble = this.fft.getEnergy("treble");
    }

    getAmountToShow() {
        return this.amountToShow;
    }

    setAmountToShow(newAmountToShow) {
        this.amountToShow = newAmountToShow;
    }

    setSelectedBar(newBar) {
        this.selectedBar = newBar;
    }

    getSelectedBar() {
        return this.selectedBar;
    }

    getBass() {
        return this.bass;
    }

    getLowMid() {
        return this.lowMid;
    }

    getMid() {
        return this.mid;
    }

    getHighMid() {
        return this.highMid;
    }

    getTreble() {
        return this.treble;
    }

    getAllAverages() {
        return this.allAverages;
    }
}

class DotsProgram {
    dots = [];

    constructor(mainProgram, easing, maxHeight) {
        this.mainProgram = mainProgram;

        const dotSize = width / this.mainProgram.amountToShow;
        this.easing = easing;

        for (let i = 0; i < this.mainProgram.amountToShow; i++) {
            this.dots[i] = new Dot(i * dotSize, 0, dotSize, this.easing, color(0, 0, 255));
        }

        this.maxHeight = maxHeight;
    }

    run() {
        for (let i = 0; i < this.mainProgram.amountToShow; i++) {
            this.dots[i].setTargetY(map(this.mainProgram.allAverages[i], 0, 255, height, 0)).draw();
            if (this.mainProgram.selectedBar === i) {
                this.dots[i].setSelected(true);
            } else {
                this.dots[i].setSelected(false);
            }
        }
    }
}

class GraphProgram {
    rectangles = [];

    constructor(fftProgram, maxHeight) {
        this.fftProgram = fftProgram;
        this.initPercentage = this.fftProgram.percentageNotToShow;
        const rectangleSize = width / this.fftProgram.amountToShow;

        for (let i = 0; i < this.fftProgram.amountToShow; i++) {
            this.rectangles[i] = new SelectableRectangle(i * rectangleSize, height, rectangleSize, -10, color(0, 0, 100));
        }

        this.maxHeight = maxHeight;
    }

    run() {
        const percentageToShow = (100 - this.initPercentage) / 100;
        this.fftProgram.setAmountToShow(this.fftProgram.amountOfBins * percentageToShow);

        rectMode(CORNER);
        for (let i = 0; i < this.fftProgram.amountToShow; i++) {
            this.rectangles[i].setHeight(-map(this.fftProgram.getAllAverages()[i], 0, 255, 0, this.maxHeight)).draw();
            if (this.fftProgram.selectedBar === i) {
                this.rectangles[i].setSelected(true);
            } else {
                this.rectangles[i].setSelected(false);
            }
        }
    }
}

class SendProgram {
    counter;
    amountOfLeds;
    value;

    constructor(mainProgram, amountOfLeds) {
        this.mainProgram = mainProgram;
        this.counter = 0;
        this.amountOfLeds = amountOfLeds;
    }

    run() {
        try {
            this.counter++;
            //todo check if counter can be removed when over serial
            // if (this.counter % 5 === 0) {
            ipcRenderer.send('setLeds', floor(this.value));
            // allEffects.createVisualizer(this.value, calculateBGRInteger(colorpicker.color.rgb.b, colorpicker.color.rgb.g, colorpicker.color.rgb.r), this.amountOfLeds, 0);
            // }
            this.counter = this.counter % 100;
        } catch (e) {
            console.error(e);
        }
    }

    setValue(newValue) {
        this.value = map(newValue, 0, 255, 0, this.amountOfLeds);
        return this;
    }
}

class CirclesProgram {
    rings = [];
    dottedRings = [];
    rectangleRings = [];
    backgroundColor;

    constructor(backgroundColor, fftProgram) {


        this.backgroundColor = backgroundColor;
        this.fftProgram = fftProgram;
        this.rings[0] = new SolidRing(0, 0, 70, 600, this.backgroundColor, color(180, 100, 100));
        this.rings[1] = new SolidRing(0, 0, 25, 350, this.backgroundColor, color(180, 100, 100));
        this.rings[2] = new SolidRing(0, 0, 10, 100, this.backgroundColor, color(180, 100, 100));

        this.dottedRings[0] = new DottedRing(0, 0, 20, 12, color(180, 100, 100), 5, -0.003);
        this.dottedRings[1] = new DottedRing(0, 0, 100, 8, color(180, 100, 100), 5, 0.05);

        this.rectangleRings[0] = new RectangleRing(0, 0, 200, 128, 0, color(180, 100, 100));

    }

    run() {
        push();
        colorMode(HSB);
        strokeWeight(5);
        ellipseMode(CENTER);
        const colorpickerColor = color(colorPicker.color.hue, colorPicker.color.saturation, colorPicker.color.value)
        translate(width / 2, height / 2)
        background(this.backgroundColor);

        this.rings[0].setDiameter(map(this.fftProgram.getBass(), 0, 255, 570, 750));
        this.rings[1].setThickness(map(this.fftProgram.getLowMid(), 0, 255, 20, 100))
        this.rings[2].setDiameter(map(this.fftProgram.getHighMid(), 0, 255, 100, 200)).setThickness(map(this.fftProgram.getHighMid(), 0, 255, 10, 70))

        this.dottedRings[1].setDiameterOfSmallCircles(map(this.fftProgram.getLowMid(), 0, 255, 3, 15)).setSpeed(map(this.fftProgram.getBass(), 0, 255, -0.13, 0.16));
        this.dottedRings[0].setSpeed(map(this.fftProgram.getTreble(), 0, 255, -0.003, -0.15));
        this.rectangleRings[0].applyFFT(this.fftProgram.getAllAverages());
        angleMode(RADIANS);

        for (let i = 0; i < this.rings.length; i++) {
            this.rings[i].setColor(colorpickerColor).draw();
        }

        for (let i = 0; i < this.dottedRings.length; i++) {
            this.dottedRings[i].setColor(colorpickerColor).draw();
        }

        for (let i = 0; i < this.rectangleRings.length; i++) {
            this.rectangleRings[i].setColor(colorpickerColor).draw();
        }
        pop();
    }
}

class DotsRoamingProgram {
    particles = [];
    particleCount = 150;
    maxDistance = 75;
    maxConnections = 5;
    fftProgram;

    constructor(fftprogram) {
        this.fftProgram = fftprogram;
        //orange
        const particleColor = color(0, 0, 255);

        for (let i = 0; i < this.particleCount; i++) {
            let p = new Particle(minSpeed, maxSpeed, particleColor);
            this.particles.push(p);
        }
    }

    run() {
        background(196, 87, 24);


        // const particleColor = color(127);
        const lineColor = color(255,255,255);


        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
            this.particles[i].update();
            this.particles[i].size = map(this.fftProgram.getBass(), 0, 255, this.particles[i].initSize, this.particles[i].initSize + 15);
        }

        for (let i = 0; i < this.particles.length - 1; i++) {

            let current = this.particles[i];
            let affected = [];

            for (let j = 0; j < this.particles.length; j++) {
                if (this.particles[j] !== current) {
                    let distance = current.position.dist(this.particles[j].position);
                    if (distance <= this.maxDistance && affected.length <= this.maxConnections) {
                        affected.push({
                            'particle': this.particles[j],
                            'distance': distance
                        });
                    }
                }
            }

            for (let a = 0; a < affected.length; a++) {
                stroke(lineColor)
                strokeWeight(map(affected[a].distance, 0, this.maxDistance, 0, 5));
                //smooth();
                line(current.position.x, current.position.y, affected[a].particle.position.x, affected[a].particle.position.y);
            }
        }

    }
}

class SimplisticRectangleProgram {
    rectangles = [];

    constructor(fftProgram) {
        this.fftProgram = fftProgram;

        const colors = ['#e91e63', '#fdd835', '#4caf50', '#00bcd4', '#3f51b5'];
        for (let i = 0; i < 5; i++) {
            this.rectangles[i] = new Rectangle(width / 2, (height / 16 * i), 10, 10, colors[i]);
        }
    }

    run() {
        push();
        background('#F8F8F8');
        noStroke();
        rectMode(CENTER);
        translate(0, height / 3);
        this.rectangles[0].setWidth(map(this.fftProgram.getBass(), 0, 255, 0, width));
        this.rectangles[1].setWidth(map(this.fftProgram.getLowMid(), 0, 255, 0, width));
        this.rectangles[2].setWidth(map(this.fftProgram.getMid(), 0, 255, 0, width));
        this.rectangles[3].setWidth(map(this.fftProgram.getHighMid(), 0, 255, 0, width));
        this.rectangles[4].setWidth(map(this.fftProgram.getTreble(), 0, 255, 0, width));

        for (let i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].draw();
        }

        pop();
    }
}

class SimplisticArcProgram {
    arcs = [];

    constructor(fftProgram) {
        this.fftProgram = fftProgram;

        this.arcs[0] = new Arc(0, 0, 300, 0, '#e91e63', 30);
        this.arcs[1] = new Arc(0, 0, 240, 0, '#fdd835', 25);
        this.arcs[2] = new Arc(0, 0, 190, 0, '#4caf50', 20);
        this.arcs[3] = new Arc(0, 0, 150, 0, '#00bcd4', 15);
        this.arcs[4] = new Arc(0, 0, 120, 0, '#3f51b5', 10);
    }

    run() {
        background('#F8F8F8');
        this.arcs[0].setEnd(map(this.fftProgram.getBass(), 0, 255, 0, 359));
        this.arcs[1].setEnd(map(this.fftProgram.getLowMid(), 0, 255, 0, 359));
        this.arcs[2].setEnd(map(this.fftProgram.getMid(), 0, 255, 0, 359));
        this.arcs[3].setEnd(map(this.fftProgram.getHighMid(), 0, 255, 0, 359));
        this.arcs[4].setEnd(map(this.fftProgram.getTreble(), 0, 255, 0, 359));

        for (let i = 0; i < this.arcs.length; i++) {
            this.arcs[i].draw();
        }
        // this.arcs[0].draw();
        // this.arcs[1].draw();
    }
}

class SpotifyProgram {
    artist;
    song;
    duration;
    progress;
    isPlaying;
    searchList;
    imageM;
    imageL;
    imageMReady;
    imageLReady;

    constructor(interval) {
        this.s = new SpotifyWebApi();

        if (urlContainingAccessToken === "") {
            // window.alert("Please authorise your Spotify account");
            //todo repair
            // window.location.replace(authURL + authRedirect);

        } else {
            this.s.setAccessToken(this.getURLQuery('#access_token', urlContainingAccessToken));
        }
        this.fetchInterval = interval;
        this.lastFetch = 0;

        this.artist = "Unknown";
        this.song = "Unknown";
        this.duration = "Unknown";
        this.progress = null;
        this.imageMReady = false;
        this.imageLReady = false;
        // this.getCurrentTrack();
    }

    run() {
        if (millis() - this.lastFetch >= this.fetchInterval) {
            this.getCurrentTrack();
            this.lastFetch = millis();
        }
    }

    getCurrentTrack() {
        const self = this;
        try {
            this.s.getGeneric("https://api.spotify.com/v1/me/player/currently-playing", function (err, data) {
                if (err) {
                    if (err.status === 401) {
                        location.reload();
                    }
                } else {
                    self.searchList = self.returnData(data)
                    // songID = self.searchList.item.id
                    if (self.song !== self.searchList.item.name) {
                        self.imageMReady = false;
                        self.imageLReady = false;
                        //The images are sorted biggest to smallest, as documented in spotify api.
                        self.imageL = loadImage(self.searchList.item.album.images[0].url, img => {
                            self.imageLReady = true;
                        });
                        self.imageM = loadImage(self.searchList.item.album.images[1].url, img => {
                            self.imageMReady = true;
                        });

                        console.info(self.searchList.item.album.images[1].url);
                    }
                    self.song = self.searchList.item.name;
                    self.artist = self.searchList.item.artists[0].name;
                    self.duration = parseInt(self.searchList.item.duration_ms);
                    self.progress = self.searchList.progress_ms;
                    self.isPlaying = self.searchList.is_playing;
                }
            });
        } catch (e) {
            console.error(e);
            self.song = "Unknown";
            self.artist = "Unknown";
            self.duration = "Unknown";
        }

    }

    millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    getURLQuery(needle, urlToCheck) {
        console.log("getUrlQuery")
        var q = urlToCheck;
        console.log("q: " + q)
        var v = q.split('&');
        console.log(v)
        for (var i = 0; i < v.length; i++) {
            var pair = v[i].split("=");
            console.log("pair no. " + i + " contains: " + pair)
            if (pair[0] == needle) {
                console.log("Set access token: " + pair[1])
                return pair[1];
            }
        }
        return false;
    }

    returnData(responseData) {
        return responseData
    }
}

class CardProgram extends SpotifyProgram {
    rectangles = [];
    mainRectangle;
    progressBar;
    marginY;
    marginX;

    constructor(fftProgram, x, y, width, height, rectangleColor, backgroundColor) {
        super(1000);

        this.backgroundColor = backgroundColor;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.marginX = width * 0.1;
        this.marginY = height * 0.2;
        this.rectangleColor = rectangleColor;


        this.mainRectangle = new Rectangle(x, y, width, height, rectangleColor, 10, 10, 10, 10);

        this.amountToSee = 100;
        this.fftProgram = fftProgram;
        this.fftProgram.setAmountToShow(this.amountToSee);

        const rectangleSize = (250 - 0) / this.fftProgram.amountToShow;
        for (let i = 0; i < this.fftProgram.amountOfBins; i++) {
            this.rectangles[i] = new Rectangle(i * rectangleSize + rectangleSize / 2, this.y + this.height - this.marginY - 100, rectangleSize, 100, this.backgroundColor);
        }

        const roboto = loadFont('fonts/Roboto-Regular.ttf');
        this.songText = new Text("SONG NAME HERE", (this.x + this.width / 2), 0 - 100 + 15, 15, color(0, 0, 0), roboto);
        this.artistText = new Text("ARTIST NAME HERE", (this.x + this.width / 2), 0 - 100 + 15 * 2, 15, color(0, 0, 0), roboto);
        this.durationText = new Text("5:55", (this.x + this.width / 2), 0 - 100 + 15 * 3, 15, color(0, 0, 0), roboto);
        this.paused = new Text("Unknown", 0, 0 - 100 + 15 * 4, 15, color(0, 100, 100), roboto);
        this.progressBar = new ProgressBar((this.x + this.width / 2), this.y + this.height - this.marginY, 250, 25, color(120, 100, 50));
    }

    run() {
        super.run();

        background(this.backgroundColor);
        this.fftProgram.setAmountToShow(this.amountToSee);
        push();
        translate(width / 2, height / 2);
        this.mainRectangle.draw();
        this.artistText.draw();
        this.songText.draw();
        this.durationText.draw();
        this.paused.draw();
        this.progressBar.draw();
        rectMode(CENTER)
        for (let i = 0; i < this.fftProgram.amountToShow; i++) {
            this.rectangles[i].setHeight(map(this.fftProgram.getAllAverages()[i], 0, 255, 0, 100)).draw();
        }
        imageMode(CENTER);
        if (this.imageMReady) {
            image(this.imageM, -this.width / 2 + 100 + this.marginX, 0, 200, 200);
        }
        pop();
        if (this.isPlaying) {
            this.paused.setText("");
        } else {
            this.paused.setText("PAUSED ||");
        }
        this.songText.setText(this.song);
        this.artistText.setText(this.artist);
        this.durationText.setText(this.millisToMinutesAndSeconds(this.duration));
        this.progressBar.setProgressWidth(map(this.progress, 0, this.duration, 0, this.progressBar.getWidth()));
    }
}

class ImageBackgroundProgram extends SpotifyProgram {

    rectangle;
    polygon;
    ellipse;
    state;

    artistText;
    songText;

    constructor(fftProgram) {
        super(1000);
        this.fftProgram = fftProgram;

        this.rectangle = new Rectangle(0, 0, width / 3, width / 3, color(0, 0, 100));
        this.polygon = new Polygon(0, 0, width / 5, 8, 255);
        this.ellipse = new Dot(0, 0, width / 3, 0, color(0, 0, 100));

        this.state = 0;
        this.lastStateChange = 0;
        this.changeStateInterval = 5000;

        const bebas = loadFont('fonts/BebasNeue-Regular.ttf');
        const thasadith = loadFont('fonts/Thasadith-Italic.ttf');
        this.songText = new Text("Unknown", 0, 0, 64, color(0, 0, 0), width / 3 - 30, 175, bebas);
        this.artistText = new Text("Unknown", 0, 100, 20, color(0, 0, 0), width / 3, 100, thasadith)
    }

    run() {
        this.songText.setText(this.song);
        this.artistText.setText("- " + this.artist);
        super.run();
        if (millis() - this.lastStateChange >= this.changeStateInterval) {
            this.lastStateChange = millis();
            this.state++;

            if (this.state > 2) {
                this.state = 0;
            }
        }
        if (this.imageLReady) {
            background(this.imageL);
        } else {
            background(0);
        }

        push();
        translate(width / 2, height / 2);
        rectMode(CENTER);
        switch (this.state) {
            case 0: {
                this.rectangle.draw();
                break;
            }
            case 1: {
                this.polygon.draw();
                break;
            }
            case 2: {
                this.ellipse.draw();
                break;
            }
        }

        textAlign(CENTER, CENTER);
        this.songText.draw();
        this.artistText.draw();
        pop();


    }
}

class MainProgram {
    fftProgram;
    dotsProgram;
    graphProgram;
    sendProgram;
    circlesProgram;
    simplisticRectangleProgram;
    simplisticArcProgram;
    cardProgram;
    imageBackgroundProgram;
    dotsRoamingProgram;

    programStatus;
    LINES_AND_DOTS;
    CIRCLES;
    SIMPLISTIC_RECTANGLES;
    CARD_PROGRAM;
    IMAGE_BACKGROUND_PROGRAM;
    DOTS_ROAMING_PROGRAM;

    modeRadioButton;
    colorCycleCheckbox;
    intervalSlider;

    hueInterval;
    lastIncrementedHue;


    constructor(amount, percentage) {
        noStroke();
        colorMode(HSB, 360, 100, 100);

        //All the different programs that are going to run.
        //FFTProgram always runs, because it always needs to analyze the music.
        //Programstatus decides which visual programs runs.
        this.fftProgram = new FFTProgram(amount, percentage);
        this.dotsProgram = new DotsProgram(this.fftProgram, 0.3, height);
        this.graphProgram = new GraphProgram(this.fftProgram, height * 0.9, percentage);
        this.sendProgram = new SendProgram(this.fftProgram, 30);
        this.circlesProgram = new CirclesProgram(color(200, 0, 10), this.fftProgram)
        this.simplisticRectangleProgram = new SimplisticRectangleProgram(this.fftProgram);
        this.simplisticArcProgram = new SimplisticArcProgram(this.fftProgram);
        this.cardProgram = new CardProgram(this.fftProgram, 0 - 300, 0 - 200, 600, 400, color(0, 0, 100), color(208, 50, 100));
        this.imageBackgroundProgram = new ImageBackgroundProgram(this.fftProgram);
        this.dotsRoamingProgram = new DotsRoamingProgram(this.fftProgram);

        //Possible states
        this.LINES_AND_DOTS = 1;
        this.CIRCLES = 2;
        this.SIMPLISTIC_RECTANGLES = 3;
        this.SIMPLISTIC_ARCS = 4;
        this.CARD_PROGRAM = 5;
        this.IMAGE_BACKGROUND_PROGRAM = 6
        this.DOTS_ROAMING_PROGRAM = 7;

        //Current state of the program.
        this.programStatus = this.CARD_PROGRAM;

        //Radio buttons to switch programstate
        this.modeRadioButton = createRadio();
        this.modeRadioButton.option('Lines and dots', this.LINES_AND_DOTS);
        this.modeRadioButton.option('Circles', this.CIRCLES);
        this.modeRadioButton.option('Simplistic rects', this.SIMPLISTIC_RECTANGLES);
        this.modeRadioButton.option('Simplistic arcs', this.SIMPLISTIC_ARCS);
        this.modeRadioButton.option('Card', this.CARD_PROGRAM).checked = true;
        this.modeRadioButton.option('Image background', this.IMAGE_BACKGROUND_PROGRAM);
        this.modeRadioButton.option('Dots roaming', this.DOTS_ROAMING_PROGRAM);

        //This is a div element on the page that already exists. This puts the radio buttons inside this div.
        //This allows for easy positioning of the radio buttons on the page.
        this.modeRadioButton.parent('input-holder');
        //Position all the radio buttons vertically
        //Source: https://bl.ocks.org/GoSubRoutine/5b18d019959031f517fc218667faa688
        //and: https://discourse.processing.org/t/how-to-organize-radio-buttons-in-separate-lines/10041/5
        this.encloseEachInputLabelPairIntoASubDiv(this.modeRadioButton);
        this.fixRadioDivElement(this.modeRadioButton);

        //Checkbox for colorcycle mode.
        this.colorCycleCheckbox = createCheckbox('Cycle colors');
        this.colorCycleCheckbox.parent('input-holder');
        //Slider to change cycle speed
        this.intervalSlider = createSlider(10, 1000, 100, 10);
        this.intervalSlider.parent('input-holder');
        //Is true when cycle mode is on.
        this.cycle = false;

        //Default cycle interval
        this.hueInterval = 100;
        //Last time the hue was changed.
        this.lastIncrementedHue = 0 - this.hueInterval;
    }

    run() {
        //Set interval to value of slider.
        this.hueInterval = this.intervalSlider.value();

        //Toggles cycle on and off.
        this.handleCheckbox();

        //Change the state of the program depending on radio button value.
        this.programStatus = parseInt(this.modeRadioButton.value());

        //Analyze the music.
        this.fftProgram.run();

        //switch the program state.
        switch (this.programStatus) {
            case this.LINES_AND_DOTS: {
                background(343, 86, 93);
                this.dotsProgram.run();
                this.graphProgram.run();
                this.sendProgram.setValue(this.fftProgram.getAllAverages()[this.fftProgram.getSelectedBar()]).run();
                break;
            }
            case this.CIRCLES: {
                this.sendProgram.setValue(this.fftProgram.getBass()).run();
                this.circlesProgram.run();
                break;
            }
            case this.SIMPLISTIC_RECTANGLES: {
                this.sendProgram.setValue(this.fftProgram.getBass()).run();
                this.simplisticRectangleProgram.run();
                break;
            }
            case this.SIMPLISTIC_ARCS: {
                this.sendProgram.setValue(this.fftProgram.getBass()).run();
                this.simplisticArcProgram.run();
                break;
            }
            case this.CARD_PROGRAM: {
                this.sendProgram.setValue(this.fftProgram.getBass()).run();
                this.cardProgram.run();
                break;
            }
            case this.IMAGE_BACKGROUND_PROGRAM: {
                this.sendProgram.setValue(this.fftProgram.getBass()).run();
                this.imageBackgroundProgram.run();
                break;
            }
            case this.DOTS_ROAMING_PROGRAM: {
                this.sendProgram.setValue(this.fftProgram.getBass()).run();
                this.dotsRoamingProgram.run();
                break;
            }
            default:
                throw 'Unknown state!'
        }
    }

    //Fired when the mouse is dragged over the canvas
    mouseDragged() {
        switch (this.programStatus) {
            case this.LINES_AND_DOTS: {
                //If the mouse is within the sketch
                if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
                    //Calculate the width of a rectangle.
                    const widthOfItem = width / this.fftProgram.getAmountToShow();

                    //Set new selectedbar.
                    let newSelectedBar = round(mouseX / widthOfItem);

                    //Check is selectedbar is >= 0 and < amount of rectangles.
                    if (newSelectedBar < 0) {
                        newSelectedBar = 0;
                    } else if (newSelectedBar > this.fftProgram.getAmountToShow()) {
                        newSelectedBar = this.fftProgram.getAmountToShow();
                    }
                    //Set the new selectedbar.
                    this.fftProgram.setSelectedBar(newSelectedBar);
                }
                break;
            }
            case this.CIRCLES: {
                break;
            }
            case this.SIMPLISTIC_RECTANGLES: {
                break;
            }
            case this.SIMPLISTIC_ARCS: {
                break;
            }
            case this.CARD_PROGRAM: {
                break;
            }
            case this.IMAGE_BACKGROUND_PROGRAM: {
                break;
            }
            case this.DOTS_ROAMING_PROGRAM: {
                break;
            }
            default:
                throw 'Unknown state!'
        }
    }

    //Fired when a key is pressed
    keyPressed() {
        switch (this.programStatus) {
            case this.LINES_AND_DOTS: {
                //If left arrow is pressed, new selectedbar is the one on the left of the current one.
                //Right arrow pressed, new selectedbar is the one on the right of the current one.
                if (keyCode === LEFT_ARROW) {
                    this.fftProgram.setSelectedBar(this.fftProgram.getSelectedBar() - 1);
                } else if (keyCode === RIGHT_ARROW) {
                    this.fftProgram.setSelectedBar(this.fftProgram.getSelectedBar() + 1);
                }

                //Make sure selectedbar cant go out of bounds.
                if (this.fftProgram.getSelectedBar() < 0) {
                    this.fftProgram.setSelectedBar(0);
                }
                if (this.fftProgram.getSelectedBar() > this.fftProgram.getAmountToShow()) {
                    this.fftProgram.setSelectedBar(this.fftProgram.getAmountToShow());
                }
                break;
            }
            case this.CIRCLES: {
                break;
            }
            case this.SIMPLISTIC_RECTANGLES: {
                break;
            }
            case this.SIMPLISTIC_ARCS: {
                break;
            }
            case this.CARD_PROGRAM: {
                break;
            }
            case this.IMAGE_BACKGROUND_PROGRAM: {
                break;
            }
            case this.DOTS_ROAMING_PROGRAM: {
                break;
            }
            default:
                throw 'Unknown state!'
        }

    }

    handleCheckbox() {
        if (this.cycle)
            this.changeHue();

        //Change cycle value based on checkbox value
        if (this.colorCycleCheckbox.checked()) {
            this.cycle = true;
        } else {
            this.cycle = false;
        }
    }

    changeHue() {
        if (millis() >= this.hueInterval + this.lastIncrementedHue) {
            colorPicker.color.hue++;
            if (colorPicker.color.hue >= 360) {
                colorPicker.color.hue = 0;
            }
            this.lastIncrementedHue = millis();
        }
    }

    encloseEachInputLabelPairIntoASubDiv(radioDivElement) {
        const inputs = selectAll('input', radioDivElement),
            labels = selectAll('label', radioDivElement),
            len = inputs.length;

        for (let i = 0; i < len; ++i)
            createDiv().parent(radioDivElement).child(inputs[i]).child(labels[i]);
    }

    fixRadioDivElement(radioDivP5Element) {
        radioDivP5Element._getInputChildrenArray = function () {
            return this.elt.getElementsByTagName('input');
        }
    }
}

let mainProgram;

const amount = 512;
const percentage = 30;

const minSpeed = 0.05;
const maxSpeed = 0.15;
const speed = 1.12;

function setup() {
    cnv = createCanvas(windowWidth * 0.65, 910);
    //Put the canvas in the #sketch-holder element on the webpage
    cnv.parent('sketch-holder');

    mainProgram = new MainProgram(amount, percentage);
}

function draw() {
    mainProgram.run();
}

function mouseDragged() {
    mainProgram.mouseDragged();
}

function keyPressed() {
    mainProgram.keyPressed();
}
