import {Component, OnInit} from '@angular/core';
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
import {ColorService} from '../../services/color/color.service';
import {ElectronService} from '../../services/electron/electron.service';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';
import {faClone, faSquare} from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'app-navigationbar',
    templateUrl: './navigationbar.component.html',
    styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit {
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

    // tslint:disable-next-line:max-line-length
    constructor(private colorService: ColorService, private electronService: ElectronService, private serialService: SerialConnectionService) {
    }

    ngOnInit(): void {
        this.window = this.electronService.remote.getCurrentWindow();
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
}
