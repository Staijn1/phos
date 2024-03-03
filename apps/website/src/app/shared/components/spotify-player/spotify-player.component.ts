import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { getDeviceType } from "../../functions";
import { SpotifyAuthenticationService } from "../../../services/spotify-authentication/spotify-authentication.service";
import { faSpotify, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { MessageService } from "../../../services/message-service/message.service";
import { Message } from "../../types/Message";
import {
  faBackward,
  faCirclePlay as PlayIcon,
  faForward,
  faPause as PauseIcon
} from "@fortawesome/free-solid-svg-icons";
import { Track } from "spotify-web-playback-sdk";

/// <reference types="@types/spotify-web-playback-sdk" />
declare global {
  interface window {
    onSpotifyWebPlaybackSDKReady: () => void;
    spotifyReady: Promise<void>;
  }
}

@Component({
  selector: "app-spotify-player",
  templateUrl: "./spotify-player.component.html",
  styleUrls: ["./spotify-player.component.scss"]
})
export class SpotifyPlayerComponent implements OnInit, OnDestroy {
  get state(): Spotify.PlaybackState | undefined {
    return this._state;
  }

  set state(value: Spotify.PlaybackState | undefined) {
    this._state = value;
    this.playbackChanged.emit(this._state);
  }

  /**
   * Emits when the spotify player is ready
   * Payload is this device id
   */
  @Output() ready: EventEmitter<string> = new EventEmitter<string>();
  @Output() playbackChanged: EventEmitter<Spotify.PlaybackState> = new EventEmitter<Spotify.PlaybackState>();
  readonly spotifyIcon = faSpotify;
  readonly previousSongIcon = faBackward;
  readonly skipSongIcon = faForward;
  spotifyAuthenticationURL!: string;
  volume = 1;
  private _state: Spotify.PlaybackState | undefined;
  private player: Spotify.Player | undefined;
  /**
   * This is a variable that is used to track how far the user is into the current track.
   * Unfortunately, we do only get this information once from the playback api so we use a setInterval to update it, until a new change comes in.
   */
  currentTrackProgress = 0;
  private updateProgressInterval: NodeJS.Timer | undefined;

  constructor(public readonly spotifyAuth: SpotifyAuthenticationService, private readonly messageService: MessageService) {
    this.spotifyAuth.generateAuthorizeURL().then(url => this.spotifyAuthenticationURL = url);
  }

  /**
   * Returns the url of the current track image.
   * If it is undefined then we return a backup image - A random image from picsum
   */
  get albumImageSrc(): string {
    return this._state?.track_window.current_track.album.images[2].url ?? "https://picsum.photos/200";
  }

  get trackName(): string {
    return this._state?.track_window.current_track.name ?? "No Track Playing";
  }

  /**
   * Get the name of the artist of the current track
   */
  get artistName(): string {
    if (!this._state?.track_window.current_track) return "No Artist Playing";
    return this.getAllArtistsNamesForTrack(this._state?.track_window.current_track);
  }

  /**
   * Get a list of all the tracks that are coming up next
   */
  get upcomingTracks(): Spotify.Track[] {
    return this._state?.track_window.next_tracks ?? [];
  }

  /**
   * Getter to get the current track
   */
  get currentTrack(): Spotify.Track {
    return this._state?.track_window.current_track as Track;
  }

  /**
   * Helper function to check if the user has selected this device in the spotify app
   * If the track window has a current track which is not null or undefined, then we are active
   */
  get isActive(): boolean {
    return !!this._state?.track_window.current_track;
  }

  /**
   * When the spotify player is paused then we show the > icon (play)
   * Otherwise we show the || icon (pause)
   */
  public get getIconForPlayStatus(): IconDefinition {
    return this._state?.paused ? PlayIcon : PauseIcon;
  }

  /**
   * On init we start to initialize the spotify player
   */
  ngOnInit() {
    this.loadSpotifyWebPlaybackSDK();
  }

  ngOnDestroy() {
    clearInterval(this.updateProgressInterval);
  }

  /**
   * Skip to the previous song
   */
  previousSong() {
    this.player?.previousTrack().catch(err => this.messageService.setMessage(err));
  }

  /**
   * Skip to the next song
   */
  skipSong() {
    this.player?.nextTrack().catch(err => this.messageService.setMessage(err));
  }

  /**
   * Play or pause the current song
   */
  togglePlay() {
    this.player?.togglePlay().catch(err => this.messageService.setMessage(err));
  }

  /**
   * A song can have multiple artists, so we join them together with a comma
   * @param song
   */
  getAllArtistsNamesForTrack(song: Track) {
    return song.artists.map(artist => artist.name).join(", ");
  }

  /**
   * Calculate the opacity of the track based on its index
   * The first upcoming track has an opacity of .8. Each track after decreases by 0.2
   * @param song
   * @param index
   */
  calculateOpacityForUpcomingTrack(song: Track, index: number) {
    return .8 - (index * 0.2);
  }

  /**
   * When the playback state changes, we emit the new state so other components can react to it
   * @param state
   * @private
   */
  private onSpotifyStateChanged(state: Spotify.PlaybackState) {
    this.currentTrackProgress = state.position;
    this.state = state;
    clearInterval(this.updateProgressInterval);
    this.updateProgressInterval = setInterval(() => this.currentTrackProgress += state.paused ? 0 : 300, 300);
  }

  /**
   * Loads the spotify web playback sdk from the spotify cdn
   * @private
   */
  private loadSpotifyWebPlaybackSDK() {
    window.onSpotifyWebPlaybackSDKReady = () => console.log("Spotify Web Playback SDK loaded");
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.defer = true;
    window.onSpotifyWebPlaybackSDKReady = () => this.onSpotifyWebPlaybackSDKReady();
    document.body.appendChild(script);
  }

  /**
   * Called when the spotify web playback sdk is ready
   * Gets the token from the spotify auth service and creates a new player
   * The application is then available to cast to from the spotify app, as a device.
   * The device has a name of Angulon - {deviceType}, for example Angulon - Windows
   * @private
   */
  private onSpotifyWebPlaybackSDKReady() {
    if (!this.spotifyAuth.isLoggedIn()) return;

    const device = getDeviceType();
    this.player = new Spotify.Player({
      name: `Phos - ${device}`,
      getOAuthToken: cb => cb(this.spotifyAuth.getToken()),
      volume: 1
      // enableMediaSession: true
    });

    this.player.addListener("initialization_error", ( error ) => {
      console.error(error);
    });

    this.player.addListener("authentication_error", ({ message }) => this.messageService.setMessage(new Message("error", message)));

    this.player.addListener("account_error", ({ message }) => this.messageService.setMessage(new Message("error", message)));
    // Ready
    this.player.addListener("ready", ({ device_id }) => this.ready.emit(device_id));

    // Not Ready
    this.player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });
    this.player.addListener("player_state_changed", state => {
      this.onSpotifyStateChanged(state);
    });
    this.player.connect().catch(err => this.messageService.setMessage(err));
  }
}
