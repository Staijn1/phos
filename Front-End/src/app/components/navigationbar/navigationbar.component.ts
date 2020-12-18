import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ColorService} from '../../services/color/color.service';
import {ElectronService} from '../../services/electron/electron.service';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
import {faClone, faSquare} from '@fortawesome/free-regular-svg-icons';
import {TimelineMax} from 'gsap';
import {NavigationEnd, Router} from '@angular/router';

import {
    faBars,
    faChartBar,
    faCog,
    faEyeDropper,
    faHome,
    faList,
    faMinus,
    faPlus,
    faRunning,
    faSlidersH,
    faTimes,
    faWalking,
    faWindowMinimize
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-navigationbar',
    templateUrl: './navigationbar.component.html',
    styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit, AfterViewInit {
    cog = faCog;
    home = faHome;
    mode = faList;
    visualizer = faChartBar;
    colorpicker = faEyeDropper;
    mobileMenu = faBars;
    isOpen = false;
    minimize = faWindowMinimize;
    maximize = faSquare;
    exit = faTimes;
    toprightMenu = faBars;
    controls = faSlidersH;
    settings = faCog;
    decreaseBrightnessIcon = faMinus;
    increaseBrightnessIcon = faPlus;
    speedIncreaseIcon = faRunning;
    speedDecreaseIcon = faWalking;


    private window: Electron.BrowserWindow;
    @ViewChild('animationObject') animationObject: ElementRef;
    private animationMode = 0;
    @Output() animationEnd = new EventEmitter<void>();

    constructor(
        private colorService: ColorService,
        private electronService: ElectronService,
        private serialService: SerialConnectionService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.window = this.electronService.remote.getCurrentWindow();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.animate();
            }
        });
    }

    ngAfterViewInit(): void {
        this.animate();
    }

    mobileNav(): void {
        if (!this.isOpen) {
            this.mobileMenu = faTimes;
        } else {
            this.mobileMenu = faBars;
        }
        this.isOpen = !this.isOpen;
        $('body').toggleClass('mobile-nav-active');
    }

    exitButtonAction(): void {
        this.window.close();
    }

    minimizeButtonAction(): void {
        this.window.minimize();
    }

    maximizeButtonAction(): void {
        if (this.window.isMaximized()) {
            this.window.unmaximize();
            this.maximize = faSquare;
        } else {
            this.window.maximize();
            this.maximize = faClone;
        }
    }

    decreaseBrightness(): void {
        this.serialService.decreaseBrightness();
    }

    increaseBrightness(): void {
        this.serialService.increaseBrightness();
    }

    decreaseSpeed(): void {
        this.serialService.decreaseSpeed();
    }

    increaseSpeed(): void {
        this.serialService.increaseSpeed();
    }

    private animationFromLeft(anime: TimelineMax): TimelineMax {
        anime.to('.from-left .tile', {
            duration: 0.4,
            width: '100%',
            left: '0%',
            delay: 0.2,
            stagger: 0.05,
        });
        anime.to('.from-left .tile', {
            duration: 0.4,
            width: '100%',
            left: '100%',
            delay: 0.2,
            stagger: -0.05,
        });
        anime.set('.from-left .tile', {left: '0', width: '0'});

        return anime;
    }

    private animate(): void {
        let timeline: TimelineMax = new TimelineMax({
            defaults: {
                ease: 'power4.inOut'
            },
            onComplete: () => {
                this.fireEvent();
            }
        }).set('#cover', {autoAlpha: 1});

        switch (this.animationMode) {
            case 0:
                timeline = this.animateFromTop(timeline);
                break;
            case 1:
                timeline = this.animationFromLeft(timeline);
                break;
        }
        this.animationMode++;
        this.animationMode = this.animationMode % 2;
    }

    private animateFromTop(anime: TimelineMax): TimelineMax {
        anime.to('.from-top .tile', {
            duration: 0.4,
            height: '100%',
            top: '0%',
            delay: 0,
            stagger: 0.05,
        }).to('.from-top .tile', {
            duration: 0.4,
            height: '100%',
            top: '100%',
            delay: 0,
            stagger: -0.05,
        }).set('.from-top .tile', {top: '0', height: '0'});
        return anime;
    }

    private fireEvent(): void {
        const anime: TimelineMax = new TimelineMax({
            defaults: {
                ease: 'power2.inOut'
            },
        });
        anime.to('#cover', {
            duration: 0.8,
            autoAlpha: 0
        });
        this.animationEnd.emit();
    }
}
