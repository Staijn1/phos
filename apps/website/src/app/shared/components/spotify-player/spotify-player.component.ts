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
  state: Spotify.PlaybackState | undefined = {
    "timestamp": 1696964893564,
    "context": {
      "uri": "spotify:playlist:62bReXvmroQzQfEUuTNe3Y",
      "metadata": {
        "name": "Chill House 2023",
        "uri": "spotify:playlist:62bReXvmroQzQfEUuTNe3Y",
        "url": "context://spotify:playlist:62bReXvmroQzQfEUuTNe3Y",
        "current_item": {
          "name": "Emergency",
          "uri": "spotify:track:6L0B2i6TKUP2vazSDqViUM",
          "url": "https://api.spotify.com/v1/tracks/6L0B2i6TKUP2vazSDqViUM",
          "uid": "eb06ec3602a8cbaa",
          "content_type": "TRACK",
          "artists": [
            {
              "name": "Lonely in the Rain",
              "uri": "spotify:artist:42KUul1wLmOdQCEYf3MweS",
              "url": "https://api.spotify.com/v1/artists/42KUul1wLmOdQCEYf3MweS"
            },
            {
              "name": "Appleby",
              "uri": "spotify:artist:4Y2i9jhU3jW0PVsvTLIbWX",
              "url": "https://api.spotify.com/v1/artists/4Y2i9jhU3jW0PVsvTLIbWX"
            }
          ],
          "images": [
            {
              "url": "https://i.scdn.co/image/ab67616d00001e027420a65ecc18867a4d68a9a8",
              "height": 300,
              "width": 300,
              "size": "UNKNOWN"
            },
            {
              "url": "https://i.scdn.co/image/ab67616d000048517420a65ecc18867a4d68a9a8",
              "height": 64,
              "width": 64,
              "size": "SMALL"
            },
            {
              "url": "https://i.scdn.co/image/ab67616d0000b2737420a65ecc18867a4d68a9a8",
              "height": 640,
              "width": 640,
              "size": "LARGE"
            }
          ],
          "estimated_duration": 168824,
          "group": {
            "name": "Emergency",
            "uri": "spotify:album:2migdnnPxbvIHUGbKlBO6M",
            "url": "https://api.spotify.com/v1/albums/2migdnnPxbvIHUGbKlBO6M"
          }
        },
        "previous_items": [
          {
            "name": "Miss You",
            "uri": "spotify:track:329PAO2XpurUBEWszXKG5K",
            "url": "https://api.spotify.com/v1/tracks/329PAO2XpurUBEWszXKG5K",
            "uid": "c83d0c5846307a1d",
            "content_type": "TRACK",
            "artists": [
              {
                "name": "Nu Aspect",
                "uri": "spotify:artist:4NhRml5ZOfNaYJAHUE0XwT",
                "url": "https://api.spotify.com/v1/artists/4NhRml5ZOfNaYJAHUE0XwT"
              },
              {
                "name": "Jamis",
                "uri": "spotify:artist:2SdcyCKXwjtQJymVLGyBlx",
                "url": "https://api.spotify.com/v1/artists/2SdcyCKXwjtQJymVLGyBlx"
              },
              {
                "name": "Poppy Baskcomb",
                "uri": "spotify:artist:4STmXOXUF3UieHU46NWLVt",
                "url": "https://api.spotify.com/v1/artists/4STmXOXUF3UieHU46NWLVt"
              }
            ],
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e0232d2d477b5d2283d88b04d55",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000485132d2d477b5d2283d88b04d55",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b27332d2d477b5d2283d88b04d55",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ],
            "estimated_duration": 194107,
            "group": {
              "name": "Miss You",
              "uri": "spotify:album:5OeAiEg5TsF2tKhwewL951",
              "url": "https://api.spotify.com/v1/albums/5OeAiEg5TsF2tKhwewL951"
            }
          },
          {
            "name": "No One Even Knows My Name",
            "uri": "spotify:track:5JoLi0mrYKRxY3hYFhPP7F",
            "url": "https://api.spotify.com/v1/tracks/5JoLi0mrYKRxY3hYFhPP7F",
            "uid": "0383bc797d0a8681",
            "content_type": "TRACK",
            "artists": [
              {
                "name": "Lucas Nord",
                "uri": "spotify:artist:4ZUg3IUvAPAl8coXQAxaXd",
                "url": "https://api.spotify.com/v1/artists/4ZUg3IUvAPAl8coXQAxaXd"
              },
              {
                "name": "Husky",
                "uri": "spotify:artist:74AV853eXs56Dqe8TSahzk",
                "url": "https://api.spotify.com/v1/artists/74AV853eXs56Dqe8TSahzk"
              }
            ],
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e027094a38beae7f2081308d9e7",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d000048517094a38beae7f2081308d9e7",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b2737094a38beae7f2081308d9e7",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ],
            "estimated_duration": 221112,
            "group": {
              "name": "No One Even Knows My Name",
              "uri": "spotify:album:0YIRQTM1wNAl6rdPfswQGt",
              "url": "https://api.spotify.com/v1/albums/0YIRQTM1wNAl6rdPfswQGt"
            }
          }
        ],
        "next_items": [
          {
            "name": "Love Language",
            "uri": "spotify:track:2kII74W6BvQZSOwXBotukX",
            "url": "https://api.spotify.com/v1/tracks/2kII74W6BvQZSOwXBotukX",
            "uid": "738d5fd28d8d23bd",
            "content_type": "TRACK",
            "artists": [
              {
                "name": "Crooked Colours",
                "uri": "spotify:artist:0aA1GTrIMutjIh4GlPPUVN",
                "url": "https://api.spotify.com/v1/artists/0aA1GTrIMutjIh4GlPPUVN"
              }
            ],
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e02a61351f4ac889baa329881e5",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d00004851a61351f4ac889baa329881e5",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b273a61351f4ac889baa329881e5",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ],
            "estimated_duration": 198961,
            "group": {
              "name": "Love Language",
              "uri": "spotify:album:1zDkevWz3xdsqVAYbdANiN",
              "url": "https://api.spotify.com/v1/albums/1zDkevWz3xdsqVAYbdANiN"
            }
          },
          {
            "name": "Lost in You",
            "uri": "spotify:track:41JyJ75Wf7NOIP3lk3JaNH",
            "url": "https://api.spotify.com/v1/tracks/41JyJ75Wf7NOIP3lk3JaNH",
            "uid": "05221ab1f3730622",
            "content_type": "TRACK",
            "artists": [
              {
                "name": "Astrality",
                "uri": "spotify:artist:6KGv020mJkIjQH5YPDSBcZ",
                "url": "https://api.spotify.com/v1/artists/6KGv020mJkIjQH5YPDSBcZ"
              },
              {
                "name": "Thandi",
                "uri": "spotify:artist:7b48KVEzrlVcLLLBAGHBuj",
                "url": "https://api.spotify.com/v1/artists/7b48KVEzrlVcLLLBAGHBuj"
              }
            ],
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e02d2b1230d587b695d59d5bd92",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d00004851d2b1230d587b695d59d5bd92",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b273d2b1230d587b695d59d5bd92",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ],
            "estimated_duration": 181251,
            "group": {
              "name": "Lost in You",
              "uri": "spotify:album:13gn0rNGUlOHhZbnG76PAW",
              "url": "https://api.spotify.com/v1/albums/13gn0rNGUlOHhZbnG76PAW"
            }
          }
        ],
        "options": {
          "shuffled": true,
          "repeat_mode": "OFF"
        },
        "restrictions": {
          "pause": [],
          "resume": [],
          "seek": [],
          "skip_next": [],
          "skip_prev": [],
          "toggle_repeat_context": [],
          "toggle_repeat_track": [],
          "toggle_shuffle": [],
          "peek_next": [],
          "peek_prev": []
        },
        "context_description": "Chill House 2023"
      }
    },
    "duration": 168871,
    "paused": true,
    "shuffle": true,
    "position": 1613,
    "loading": false,
    "repeat_mode": 0,
    "track_window": {
      "current_track": {
        "id": "6L0B2i6TKUP2vazSDqViUM",
        "uri": "spotify:track:6L0B2i6TKUP2vazSDqViUM",
        "type": "track",
        "uid": "eb06ec3602a8cbaa",
        "linked_from": {
          "uri": null,
          "id": null
        },
        "media_type": "audio",
        "track_type": "audio",
        "name": "Emergency",
        "duration_ms": 168871,
        "artists": [
          {
            "name": "Lonely in the Rain",
            "uri": "spotify:artist:42KUul1wLmOdQCEYf3MweS",
            "url": "https://api.spotify.com/v1/artists/42KUul1wLmOdQCEYf3MweS"
          },
          {
            "name": "Appleby",
            "uri": "spotify:artist:4Y2i9jhU3jW0PVsvTLIbWX",
            "url": "https://api.spotify.com/v1/artists/4Y2i9jhU3jW0PVsvTLIbWX"
          }
        ],
        "album": {
          "name": "Emergency",
          "uri": "spotify:album:2migdnnPxbvIHUGbKlBO6M",
          "images": [
            {
              "url": "https://i.scdn.co/image/ab67616d00001e027420a65ecc18867a4d68a9a8",
              "height": 300,
              "width": 300,
              "size": "UNKNOWN"
            },
            {
              "url": "https://i.scdn.co/image/ab67616d000048517420a65ecc18867a4d68a9a8",
              "height": 64,
              "width": 64,
              "size": "SMALL"
            },
            {
              "url": "https://i.scdn.co/image/ab67616d0000b2737420a65ecc18867a4d68a9a8",
              "height": 640,
              "width": 640,
              "size": "LARGE"
            }
          ]
        },
        "is_playable": true
      },
      "next_tracks": [
        {
          "id": "2kII74W6BvQZSOwXBotukX",
          "uri": "spotify:track:2kII74W6BvQZSOwXBotukX",
          "type": "track",
          "uid": "738d5fd28d8d23bd",
          "linked_from": {
            "uri": null,
            "id": null
          },
          "media_type": "video",
          "track_type": "video",
          "name": "Love Language",
          "duration_ms": 198961,
          "artists": [
            {
              "name": "Crooked Colours",
              "uri": "spotify:artist:0aA1GTrIMutjIh4GlPPUVN",
              "url": "https://api.spotify.com/v1/artists/0aA1GTrIMutjIh4GlPPUVN"
            }
          ],
          "album": {
            "name": "Love Language",
            "uri": "spotify:album:1zDkevWz3xdsqVAYbdANiN",
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e02a61351f4ac889baa329881e5",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d00004851a61351f4ac889baa329881e5",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b273a61351f4ac889baa329881e5",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ]
          },
          "is_playable": true
        },
        {
          "id": "41JyJ75Wf7NOIP3lk3JaNH",
          "uri": "spotify:track:41JyJ75Wf7NOIP3lk3JaNH",
          "type": "track",
          "uid": "05221ab1f3730622",
          "linked_from": {
            "uri": null,
            "id": null
          },
          "media_type": "video",
          "track_type": "video",
          "name": "Lost in You",
          "duration_ms": 181251,
          "artists": [
            {
              "name": "Astrality",
              "uri": "spotify:artist:6KGv020mJkIjQH5YPDSBcZ",
              "url": "https://api.spotify.com/v1/artists/6KGv020mJkIjQH5YPDSBcZ"
            },
            {
              "name": "Thandi",
              "uri": "spotify:artist:7b48KVEzrlVcLLLBAGHBuj",
              "url": "https://api.spotify.com/v1/artists/7b48KVEzrlVcLLLBAGHBuj"
            }
          ],
          "album": {
            "name": "Lost in You",
            "uri": "spotify:album:13gn0rNGUlOHhZbnG76PAW",
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e02d2b1230d587b695d59d5bd92",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d00004851d2b1230d587b695d59d5bd92",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b273d2b1230d587b695d59d5bd92",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ]
          },
          "is_playable": true
        }
      ],
      "previous_tracks": [
        {
          "id": "329PAO2XpurUBEWszXKG5K",
          "uri": "spotify:track:329PAO2XpurUBEWszXKG5K",
          "type": "track",
          "uid": "c83d0c5846307a1d",
          "linked_from": {
            "uri": null,
            "id": null
          },
          "media_type": "video",
          "track_type": "video",
          "name": "Miss You",
          "duration_ms": 194107,
          "artists": [
            {
              "name": "Nu Aspect",
              "uri": "spotify:artist:4NhRml5ZOfNaYJAHUE0XwT",
              "url": "https://api.spotify.com/v1/artists/4NhRml5ZOfNaYJAHUE0XwT"
            },
            {
              "name": "Jamis",
              "uri": "spotify:artist:2SdcyCKXwjtQJymVLGyBlx",
              "url": "https://api.spotify.com/v1/artists/2SdcyCKXwjtQJymVLGyBlx"
            },
            {
              "name": "Poppy Baskcomb",
              "uri": "spotify:artist:4STmXOXUF3UieHU46NWLVt",
              "url": "https://api.spotify.com/v1/artists/4STmXOXUF3UieHU46NWLVt"
            }
          ],
          "album": {
            "name": "Miss You",
            "uri": "spotify:album:5OeAiEg5TsF2tKhwewL951",
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e0232d2d477b5d2283d88b04d55",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000485132d2d477b5d2283d88b04d55",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b27332d2d477b5d2283d88b04d55",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ]
          },
          "is_playable": true
        },
        {
          "id": "5JoLi0mrYKRxY3hYFhPP7F",
          "uri": "spotify:track:5JoLi0mrYKRxY3hYFhPP7F",
          "type": "track",
          "uid": "0383bc797d0a8681",
          "linked_from": {
            "uri": null,
            "id": null
          },
          "media_type": "video",
          "track_type": "video",
          "name": "No One Even Knows My Name",
          "duration_ms": 221112,
          "artists": [
            {
              "name": "Lucas Nord",
              "uri": "spotify:artist:4ZUg3IUvAPAl8coXQAxaXd",
              "url": "https://api.spotify.com/v1/artists/4ZUg3IUvAPAl8coXQAxaXd"
            },
            {
              "name": "Husky",
              "uri": "spotify:artist:74AV853eXs56Dqe8TSahzk",
              "url": "https://api.spotify.com/v1/artists/74AV853eXs56Dqe8TSahzk"
            }
          ],
          "album": {
            "name": "No One Even Knows My Name",
            "uri": "spotify:album:0YIRQTM1wNAl6rdPfswQGt",
            "images": [
              {
                "url": "https://i.scdn.co/image/ab67616d00001e027094a38beae7f2081308d9e7",
                "height": 300,
                "width": 300,
                "size": "UNKNOWN"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d000048517094a38beae7f2081308d9e7",
                "height": 64,
                "width": 64,
                "size": "SMALL"
              },
              {
                "url": "https://i.scdn.co/image/ab67616d0000b2737094a38beae7f2081308d9e7",
                "height": 640,
                "width": 640,
                "size": "LARGE"
              }
            ]
          },
          "is_playable": true
        }
      ]
    },
    "restrictions": {
      "disallow_seeking_reasons": [],
      "disallow_skipping_next_reasons": [],
      "disallow_skipping_prev_reasons": [],
      "disallow_toggling_repeat_context_reasons": [],
      "disallow_toggling_repeat_track_reasons": [],
      "disallow_toggling_shuffle_reasons": [],
      "disallow_peeking_next_reasons": [],
      "disallow_peeking_prev_reasons": [],
      "disallow_pausing_reasons": [
        "already_paused"
      ]
    },
    "disallows": {
      "seeking": false,
      "skipping_next": false,
      "skipping_prev": false,
      "toggling_repeat_context": false,
      "toggling_repeat_track": false,
      "toggling_shuffle": false,
      "peeking_next": false,
      "peeking_prev": false,
      "pausing": true
    },
    "playback_id": "4886f05c005e4f3eb54347462e72eaf0",
    "playback_quality": "VERY_HIGH",
    "playback_features": {
      "hifi_status": "NONE"
    },
    "playback_speed": 0
  };
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
    return this.getAllArtistsNamesForTrack(this.state?.track_window.current_track);
  }

  /**
   * Get a list of all the tracks that are coming up next
   */
  get upcomingTracks(): Spotify.Track[] {
    return this.state?.track_window.next_tracks ?? [];
  }

  /**
   * Getter to get the current track
   */
  get currentTrack(): Spotify.Track {
    return this.state?.track_window.current_track as Track;
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
    return this.state?.paused ? PlayIcon : PauseIcon;
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
    this.playbackChanged.emit(state);

    this.updateProgressInterval = setInterval(() => {
      this.currentTrackProgress += 500;
    }, 500);
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

    const token = this.spotifyAuth.getToken();
    const device = getDeviceType();
    this.player = new Spotify.Player({
      name: `Angulon - ${device}`,
      getOAuthToken: cb => cb(token),
      volume: 1
      // enableMediaSession: true
    });

    this.player.addListener("initialization_error", ({ message }) => {
      console.error(message);
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
      this.state = state;
      this.onSpotifyStateChanged(state);
    });
    this.player.connect().catch(err => this.messageService.setMessage(err));
  }
}
