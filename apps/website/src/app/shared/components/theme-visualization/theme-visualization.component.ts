import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserPreferences } from "../../types/types";
import { Store } from "@ngrx/store";
import { ChangeGeneralSettings } from "../../../../redux/user-preferences/user-preferences.action";

@Component({
  selector: "app-theme-visualization",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./theme-visualization.component.html",
  styleUrls: ["./theme-visualization.component.scss"]
})
export class ThemeVisualizationComponent {
  @Input() themeName: string | undefined;

  constructor(private readonly store: Store<{
    userPreferences: UserPreferences
  }>) {
  }

  selectTheme() {
    this.store.dispatch(new ChangeGeneralSettings({ theme: this.themeName }));
  }
}
