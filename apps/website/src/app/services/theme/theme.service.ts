import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserPreferences } from "../../shared/types/types";
import { MessageService } from "../message-service/message.service";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private _theme = "";
  get theme(): string {
    return this._theme;
  }

  constructor(private readonly messageService: MessageService, private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
  }

  initialize(): void {
    this.store.select("userPreferences").subscribe(userPreferences => {
      this.applyTheme(userPreferences.settings.theme);
    });
  }

  applyTheme(theme: string) {
    // Set the data-theme attribute on the html tag. This will apply one of the (custom or built-in) daisyui themes
    document.documentElement.setAttribute("data-theme", theme);

    // Get the theme-color meta-tag.
    // The value of this tag will change the color of the address bar when installed as a PWA
    const metaTag = document.querySelector("meta[name=\"theme-color\"]");

    // Situation: We want to set the color of the address bar to the primary color of the theme. But the primary color is defined in CSS variables
    // Problem: The meta-tag does not support CSS variables
    // Solution: Get the value of the CSS variable and use it in the meta-tag to prevent usage of the var() function in the meta-tag
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--p");
    metaTag?.setAttribute("content", `hsl(${primaryColor}`);

    this._theme = theme;
  }
}
