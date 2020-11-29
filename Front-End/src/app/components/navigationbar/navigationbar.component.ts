import {Component, OnInit} from '@angular/core';
import {faBars, faChartBar, faCog, faHome, faList} from '@fortawesome/free-solid-svg-icons';

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

    constructor() {
    }

    ngOnInit(): void {
        $(document).on('click', '.mobile-nav-toggle', function(e) {
            $('body').toggleClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        });
    }
}
