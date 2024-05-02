import { Component, OnInit } from '@angular/core';
import { SpotifyAuthenticationService } from '../../services/spotify-authentication/spotify-authentication.service';
import { Router } from '@angular/router';
import { NgIf } from "@angular/common";

@Component({
  selector: "app-spotify-authentication-callback",
  templateUrl: "./spotify-authentication-callback.component.html",
  styleUrls: ["./spotify-authentication-callback.component.scss"],
  imports: [
    NgIf
  ],
  standalone: true
})
export class SpotifyAuthenticationCallbackComponent implements OnInit {
  authenticationSuccessfull = true;

  constructor(private readonly spotifyAuth: SpotifyAuthenticationService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.spotifyAuth.ensureTokenValidity().then(() => {
      this.spotifyAuth.completeLogin()
        .then(() => this.router.navigate(['/visualizer']))
        .catch(() => this.authenticationSuccessfull = false);
    }).catch(() => this.authenticationSuccessfull = false);
  }
}
