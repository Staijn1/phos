import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {getDeviceType} from "../../functions";
import {SpotifyAuthenticationService} from "../../../services/spotify-authentication/spotify-authentication.service";
import {faSpotify, IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {MessageService} from "../../../services/message-service/message.service";
import {Message} from "../../types/Message";
import {faBackward, faForward, faPause, faPlay, faTimesCircle} from "@fortawesome/free-solid-svg-icons";

/// <reference types="@types/spotify-web-playback-sdk" />
declare global {
  interface window {
    onSpotifyWebPlaybackSDKReady: () => void;
    spotifyReady: Promise<void>;
  }
}

@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  styleUrls: ['./spotify-player.component.scss'],
})
export class SpotifyPlayerComponent implements OnInit {
  @Output() playbackChanged: EventEmitter<Spotify.PlaybackState> = new EventEmitter<Spotify.PlaybackState>();
  /**
   * Emits when the spotify player is ready
   * Payload is this device id
   */
  @Output() ready: EventEmitter<string> = new EventEmitter<string>();
  private player: Spotify.Player | undefined;
  readonly spotifyIcon = faSpotify;
  spotifyAuthenticationURL!: string;
  previousSongIcon = faBackward;
  skipSongIcon = faForward;
  readonly pauseIcon = faPause;
  readonly playIcon = faPlay;
  private state: Spotify.PlaybackState | undefined;
  notActiveIcon = faTimesCircle;

  /**
   * Returns the url of the current track image.
   * If it is undefined then we return a backup image - A random image from picsum
   */
  get albumImageSrc(): string {
    return this.state?.track_window.current_track.album.images[2].url ?? "https://picsum.photos/200";
  }

  get trackName(): string {
    return this.state?.track_window.current_track.name ?? "No Track Playing";
  }

  get artistName(): string {
    return this.state?.track_window.current_track.artists[0].name ?? "No Artist Playing";
  }

  /**
   * Helper function to check if the user has selected this device in the spotify app
   * If the track window has a current track which is not null or undefined, then we are active
   */
  get isActive(): boolean {
    return !!this.state?.track_window.current_track;
  }

  /**
   * When the spotify player is paused then we show the > icon (play)
   * Otherwise we show the || icon (pause)
   */
  public get playIconWhenPlaying(): IconDefinition {
    return this.state?.paused ? this.playIcon : this.pauseIcon;
  }

  constructor(public readonly spotifyAuth: SpotifyAuthenticationService, private readonly messageService: MessageService) {
    this.spotifyAuth.generateAuthorizeURL().then(url => this.spotifyAuthenticationURL = url)
  }

  ngOnInit() {
    this.loadSpotifyWebPlaybackSDK();
  }

  /**
   * Pauses or unpause the spotify player
   */
  toggleSpotifyPlayerPlay() {
    this.player?.togglePlay();
  }

  private onSpotifyStateChanged(state: Spotify.PlaybackState) {
    this.playbackChanged.emit(state);
  }

  private loadSpotifyWebPlaybackSDK() {
    window.onSpotifyWebPlaybackSDKReady = () => console.log("Spotify Web Playback SDK loaded");
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.defer = true;
    window.onSpotifyWebPlaybackSDKReady = () => this.onSpotifyWebPlaybackSDKReady();
    document.body.appendChild(script);
  }

  private onSpotifyWebPlaybackSDKReady() {
    const token = this.spotifyAuth.getToken()
    const device = getDeviceType();
    this.player = new Spotify.Player({
      name: `Angulon - ${device}`,
      getOAuthToken: cb => cb(token),
      volume: 1
    });

    this.player.addListener("initialization_error", ({message}) => {
      console.error(message);
    });

    this.player.addListener("authentication_error", ({message}) => this.messageService.setMessage(new Message('error', message)));

    this.player.addListener("account_error", ({message}) => this.messageService.setMessage(new Message('error', message)));
    // Ready
    this.player.addListener("ready", ({device_id}) => this.ready.emit(device_id));

    // Not Ready
    this.player.addListener("not_ready", ({device_id}) => {
      console.log("Device ID has gone offline", device_id);
    });
    this.player.addListener("player_state_changed", state => {
      this.state = state;
      console.log('state changed', state)
      this.onSpotifyStateChanged(state)
    });
    this.player.connect();
  }

  previousSong() {
    this.player?.previousTrack();
  }

  skipSong() {
    this.player?.nextTrack();
  }

  togglePlay() {
    this.player?.togglePlay();
  }
}
