import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SpotifyAuthenticationCallbackComponent } from "./spotify-authentication-callback.component";

describe("SpotifyAuthenticationCallbackComponent", () => {
  let component: SpotifyAuthenticationCallbackComponent;
  let fixture: ComponentFixture<SpotifyAuthenticationCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpotifyAuthenticationCallbackComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotifyAuthenticationCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
