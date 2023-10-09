import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserPreferences } from "../../shared/types/types";
import { themes } from "../../shared/constants";
import { MessageService } from "../message-service/message.service";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private _theme = '';
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
    this._theme = theme;
  }
}
