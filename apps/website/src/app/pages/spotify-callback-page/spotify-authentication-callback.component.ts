import { Component, OnInit } from '@angular/core';
import { SpotifyAuthenticationService } from '../../services/spotify-authentication/spotify-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spotify-authentication-callback',
  templateUrl: './spotify-authentication-callback.component.html',
  styleUrls: ['./spotify-authentication-callback.component.scss'],
  standalone: true
})
export class SpotifyAuthenticationCallbackComponent implements OnInit {
  authenticationSuccessfull = true;

  constructor(private readonly spotifyAuth: SpotifyAuthenticationService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.spotifyAuth.completeLogin().then(r => this.router.navigate(['/'])).catch(e => this.authenticationSuccessfull = false);
  }
}
