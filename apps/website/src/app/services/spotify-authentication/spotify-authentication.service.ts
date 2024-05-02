import { Injectable, OnDestroy } from "@angular/core";
import { MessageService } from "../message-service/message.service";

/**
 * Handles the authentication process with Spotify, using the Spotify Web API.
 * It follows the Authorization code with PKCE flow.
 * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/
 */
@Injectable({
  providedIn: "root"
})
export class SpotifyAuthenticationService implements OnDestroy {
  /**
   * The ID of the spotify application registered in the Spotify developer portal.
   */
  private readonly CLIENT_ID = "8df4bf11f92b4d3286f0f26ea96d9241";
  /**
   *  Scopes are used to grant your app access to different parts of the Spotify API.
   *  The scopes are separated by a space.
   *  The scope 'streaming' is required to play music.
   */
  private readonly SCOPES = "streaming user-modify-playback-state user-read-playback-state";

  /**
   * The redirect URI is the URL where the user will be redirected after the authentication process.
   * It must be registered in the Spotify developer portal.
   * The redirect URI is the current URL, with the last part replaced by 'spotify-callback'.
   * Example, current URL = 'https://some-subdomain.domain.nl/some-path/home' will become 'https://some-subdomain.domain.nl/some-path/spotify-callback'
   */
  private readonly REDIRECT_URI = window.location.href.replace(/\/[^/]*$/, "/spotify-callback");
  private refreshAccesTokenInterval: NodeJS.Timer | undefined;

  constructor(private messageService: MessageService) {
    this.startRefreshAccessTokenCycle();
  }

  private startRefreshAccessTokenCycle() {
    if (this.isLoggedIn()) {
      console.log("Starting refresh token interval");
      clearInterval(this.refreshAccesTokenInterval);
      this.refreshAccesTokenInterval = setInterval(() => {
        this.ensureTokenValidity().catch(e => this.messageService.setMessage(e));
      }, 600000); // Refresh token every 10 minutes
    }
  }

  ngOnDestroy() {
    clearInterval(this.refreshAccesTokenInterval);
  }

  /**
   * Ensures the validity of the Spotify access token, refreshing it if necessary.
   * @returns {Promise<void>}
   */
  async ensureTokenValidity(): Promise<void> {
    const tokenSet = JSON.parse(sessionStorage.getItem("spotifyToken") as string);
    if (!tokenSet) {
      console.log("No Spotify token set found.");
      return;
    }

    const now = new Date();
    const expiresAt = new Date(tokenSet.expires_at);
    if (now >= expiresAt) {
      console.log("Spotify token has expired, refreshing...");
      await this.refreshAccessToken();
    } else {
      console.log("Spotify token is still valid.");
    }
  }

  /**
   * Returns the URL to start the authentication process.
   * The user will be redirected to this URL, where he will have to authorize with Spotify.
   * He will be redirected to the redirect_uri specified.
   * @returns {string}
   */
  async generateAuthorizeURL(): Promise<string> {
    // https://tools.ietf.org/html/rfc7636#section-4.1
    const codeVerifier = this.base64urlEncode(this.randomBytes(96));
    const generatedState = this.base64urlEncode(this.randomBytes(96));

    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      response_type: "code",
      redirect_uri: this.REDIRECT_URI,
      code_challenge_method: "S256",
      code_challenge: await this.generateCodeChallenge(codeVerifier),
      state: generatedState,
      scope: this.SCOPES
    });

    sessionStorage.setItem("spotifyCodeVerifier", codeVerifier);
    sessionStorage.setItem("spotifyAuthenticationState", generatedState);

    return `https://accounts.spotify.com/authorize?${params}`;
  }

  /**
   * Helper function to generate the code_challenge for the authorization code flow.
   * https://tools.ietf.org/html/rfc7636#section-4.2
   * @param codeVerifier - Code verifier to use further with authentication
   */
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const codeVerifierBytes = new TextEncoder().encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest("SHA-256", codeVerifierBytes);
    return this.base64urlEncode(new Uint8Array(hashBuffer));
  }

  /**
   * Helper function to generate a random byte array which is used as a code verifier and state.
   * @param size - Size of array to generate
   */
  randomBytes(size: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(size));
  }

  /**
   * Helper function to encode a byte array to a base64 string.
   * @param bytes - Bytes to encode
   */
  base64urlEncode(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  /**
   * Helper function to check if the user is authenticated.
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    return (!!sessionStorage.getItem("spotifyToken"));
  }

  /**
   * Last step of the authentication process., by requesting an access token.
   * @returns {Promise<void>}
   */
  async completeLogin(): Promise<string | null> {
    const codeVerifier = sessionStorage.getItem("spotifyCodeVerifier") as string;

    const params = new URLSearchParams(location.search);

    const token = await this.createAccessToken({
      grant_type: "authorization_code",
      code: params.get("code") as string,
      redirect_uri: this.REDIRECT_URI,
      code_verifier: codeVerifier
    });

    this.startRefreshAccessTokenCycle();
    return token;
  }

  /**
   * @param params - Params to send with request
   * @returns Promise with access token as string, null if an error occurred
   */
  async createAccessToken(params: Record<string, string>): Promise<string | null> {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: this.CLIENT_ID,
          ...params
        })
      });
      const json = await response.json();
      const accessToken = json.access_token;

      sessionStorage.setItem("spotifyToken", JSON.stringify(json));
      return accessToken;
    } catch (e) {
      if (e instanceof Error) this.messageService.setMessage(e);
      return null;
    }
  }


  /**
   * @returns Contains the current tokenset if still valid otherwise null
   */
  async refreshAccessToken(): Promise<string | null> {
    console.log("Refreshing spotify access token");
    let tokenSet = JSON.parse(sessionStorage.getItem("spotifyToken") as string);

    if (!tokenSet) {
      return null;
    }

    if (tokenSet.expires_at < Date.now()) {
      tokenSet = await this.createAccessToken({
        grant_type: "refresh_token",
        refresh_token: tokenSet.refresh_token
      });
    }

    return tokenSet.access_token;
  }

  /**
   * Log out by clearing the session storage
   */
  logOut(): void {
    sessionStorage.clear();
  }

  getToken() {
    return JSON.parse(sessionStorage.getItem("spotifyToken") as string).access_token;
  }
}
