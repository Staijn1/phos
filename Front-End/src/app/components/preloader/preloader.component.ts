import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Preloader
    $(window).on('load', () => {
      const loader = $('#preloader')
      if (loader.length) {
        loader.delay(100).fadeOut('slow', function() {
          $(this).remove();
        });
      }
    });
  }
}
