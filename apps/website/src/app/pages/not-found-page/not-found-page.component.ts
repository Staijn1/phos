import {Component, OnInit} from '@angular/core';
import {ThemeService} from "../../services/theme/theme.service";
import {gsap} from 'gsap'

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent implements OnInit {
  theme!: string;

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.theme;
  }

  ngOnInit(): void {
  }
}
