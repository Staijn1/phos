import {Component, OnInit} from '@angular/core';
import {faBars, faChartBar, faCog, faHome, faList, faTimes} from '@fortawesome/free-solid-svg-icons';
import {ColorService} from '../../services/color/color.service';
import * as $ from 'jquery';

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
    colorpicker = this.visualizer;
    mobileMenu = faBars;
    isOpen = false;

    constructor(private colorService: ColorService) {
    }

    ngOnInit(): void {
    }

    mobileNav() {
        if (!this.isOpen) {
            this.mobileMenu = faTimes;
        } else {
            this.mobileMenu = faBars;
        }
        this.isOpen = !this.isOpen;
        $('body').toggleClass('mobile-nav-active');
    }
}
