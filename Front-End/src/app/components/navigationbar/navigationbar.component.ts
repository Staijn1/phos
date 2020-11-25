import {Component, OnInit} from '@angular/core';
import {faCog} from '@fortawesome/free-solid-svg-icons/faCog';

@Component({
    selector: 'app-navigationbar',
    templateUrl: './navigationbar.component.html',
    styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit {
    cog = faCog;

    constructor() {
    }

    ngOnInit(): void {
    }

}
