import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserPreferences } from "../../shared/types/types";
import { themes } from "../../shared/constants";
import { MessageService } from "../message-service/message.service";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private _theme = "default";
  get theme(): string {
    return this._theme;
  }

  constructor(private readonly messageService: MessageService, private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
  }

  initialize(): void {
    this.store.select("userPreferences").subscribe(userPreferences => {
      this.applyTheme(userPreferences.settings.theme, userPreferences.settings.darkModeEnabled);
    });
  }

  applyTheme(theme: string, darkModeEnabled: boolean) {
    // Find the theme color that matches the theme name
    const metaColor = themes.find(t => t.name === theme)?.color;
    if (!metaColor) {
      this.messageService.setMessage(new Error(`Requested theme ${theme} does not exist`));
      return;
    }

    const metaTag = document.querySelector("meta[name=\"theme-color\"]");
    metaTag?.setAttribute("content", metaColor);

    document.body.className = [theme, darkModeEnabled ? "dark" : undefined].join(" ");
    this._theme = theme;
  }
}
