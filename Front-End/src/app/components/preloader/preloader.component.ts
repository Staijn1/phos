import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-preloader',
    templateUrl: './preloader.component.html',
    styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
        // Preloader
        const loader = $('#preloader');
        if (loader.length) {
            loader.delay(100).fadeOut('slow', () => {
                $(this).remove();
            });
        }
    }
}
