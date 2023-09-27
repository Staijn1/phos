import { Component } from "@angular/core";
import { ThemeService } from "../../services/theme/theme.service";

@Component({
  selector: "app-not-found-page",
  templateUrl: "./not-found-page.component.html",
  styleUrls: ["./not-found-page.component.scss"]
})
export class NotFoundPageComponent {
  theme!: string;

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.theme;
  }
}
