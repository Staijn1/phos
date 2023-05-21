import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {getDeviceType} from "../../functions";
import {SpotifyAuthenticationService} from "../../../services/spotify-authentication/spotify-authentication.service";
import {faSpotify, IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {MessageService} from "../../../services/message-service/message.service";
import {Message} from "../../types/Message";
import {faBackward, faForward, faPause, faPlay, faVolumeHigh, faVolumeLow} from "@fortawesome/free-solid-svg-icons";
import {Track} from "spotify-web-playback-sdk";

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
  /**
   * Emits when the spotify player is ready
   * Payload is this device id
   */
  @Output() ready: EventEmitter<string> = new EventEmitter<string>();
  @Output() playbackChanged: EventEmitter<Spotify.PlaybackState> = new EventEmitter<Spotify.PlaybackState>();
  readonly spotifyIcon = faSpotify;
  readonly previousSongIcon = faBackward;
  readonly skipSongIcon = faForward;
  readonly pauseIcon = faPause;
  readonly playIcon = faPlay;
  readonly volumeLowIcon = faVolumeLow;
  readonly volumeHighIcon = faVolumeHigh;
  private player: Spotify.Player | undefined;
  spotifyAuthenticationURL!: string;
  volume = 1;
  state: Spotify.PlaybackState | undefined ;

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

  /**
   * Get the name of the artist of the current track
   */
  get artistName(): string {
    if (!this.state?.track_window.current_track) return "No Artist Playing";
    return this.getArtistNames(this.state?.track_window.current_track)
  }

  /**
   * Get a list of all the tracks that are coming up next
   */
  get upcomingTracks(): Spotify.Track[] {
    return this.state?.track_window.next_tracks ?? [];
  }

  /**
   * Get a list of all previously played tracks
   */
  get previousTracks(): Spotify.Track[] {
    return this.state?.track_window.previous_tracks ?? [];
  }

  /**
   * Getter to get the current track
   */
  get currentTrack(): Spotify.Track {
    return this.state?.track_window.current_track as Track;
  }

  /**
   * Combine the previous, current and upcoming tracks into one array
   */
  get allTracks(): Spotify.Track[] {
    return [...this.previousTracks, this.currentTrack, ...this.upcomingTracks];
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
  public get getIconForPlayStatus(): IconDefinition {
    return this.state?.paused ? this.playIcon : this.pauseIcon;
  }

  constructor(public readonly spotifyAuth: SpotifyAuthenticationService, private readonly messageService: MessageService) {
    this.spotifyAuth.generateAuthorizeURL().then(url => this.spotifyAuthenticationURL = url)
  }

  /**
   * On init we start to initialize the spotify player
   */
  ngOnInit() {
    this.loadSpotifyWebPlaybackSDK();
  }

  /**
   * When the playback state changes, we emit the new state so other components can react to it
   * @param state
   * @private
   */
  private onSpotifyStateChanged(state: Spotify.PlaybackState) {
    this.playbackChanged.emit(state);
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
    const token = this.spotifyAuth.getToken()
    const device = getDeviceType();
    this.player = new Spotify.Player({
      name: `Angulon - ${device}`,
      getOAuthToken: cb => cb(token),
      volume: 1,
      enableMediaSession: true
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

  /**
   * Skip to the previous song
   */
  previousSong() {
    this.player?.previousTrack();
  }

  /**
   * Skip to the next song
   */
  skipSong() {
    this.player?.nextTrack();
  }

  /**
   * Play or pause the current song
   */
  togglePlay() {
    this.player?.togglePlay();
  }

  /**
   * Called when the user changes the volume on the volume slider
   */
  changeVolume() {
    this.player?.setVolume(this.volume);
  }

  /**
   * A song can have multiple artists, so we join them together with a comma
   * @param song
   */
  getArtistNames(song: Track) {
    return song.artists.map(artist => artist.name).join(", ");
  }

  /**
   * Calculate the opacity of the track based on its index
   * The current track is always 1. The previous tracks come before the current track and have an increasing opacity based on their index
   * The upcoming tracks come after the current track and have a decreasing opacity based on their index
   * @param song
   * @param index
   */
  calculateOpacityForTrack(song: Track, index: number) {
    if (song == this.currentTrack) return 1;
    if (index < this.previousTracks.length) return 0.7 - (index * 0.2);

    return 0.7 - ((index - this.upcomingTracks.length) * 0.2);
  }
}
