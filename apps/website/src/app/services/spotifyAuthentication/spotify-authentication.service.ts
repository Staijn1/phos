import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from '../../../environments/environment';
import {CustomError} from '../../types/CustomError';
import {HTTPService} from '../http/http-service.service';


/**
 * Handles the authentication process with Spotify, using the Spotify Web API.
 * It follows the Authorization code with PKCE flow.
 * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/
 */
@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthenticationService extends HTTPService {
  // The ID of the spotify application registered in the Spotify developer portal.
  private readonly CLIENT_ID = '0ad647aa391e490ba42610b5dde235b4';
  // Scopes is a space-separated list of scopes, found in the spotify API documentation.
  private readonly SCOPES = 'user-top-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
  // The redirect URI is the URL where the user will be redirected after the authentication process.
  // It must be registered in the Spotify developer portal.
  private readonly REDIRECT_URI = environment.redirect_uri;
  @Output() errorEvent = new EventEmitter<CustomError>();

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
      response_type: 'code',
      redirect_uri: this.REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: await this.generateCodeChallenge(codeVerifier),
      state: generatedState,
      scope: this.SCOPES
    });

    sessionStorage.setItem('codeVerifier', codeVerifier);
    sessionStorage.setItem('state', generatedState);

    return `https://accounts.spotify.com/authorize?${params}`;
  }

  /**
   * Helper function to generate the code_challenge for the authorization code flow.
   * https://tools.ietf.org/html/rfc7636#section-4.2
   * @param codeVerifier - Code verifier to use further with authentication
   */
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const codeVerifierBytes = new TextEncoder().encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', codeVerifierBytes);
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
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  /**
   * Helper function to check if the user is authenticated.
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    return (!!sessionStorage.getItem('tokenSet'));
  }

  /**
   * Last step of the authentication process., by requesting an access token.
   * @returns {Promise<void>}
   */
  async completeLogin(): Promise<void> {
    const codeVerifier = sessionStorage.getItem('codeVerifier') as string;

    const params = new URLSearchParams(location.search);

    await this.createAccessToken({
      grant_type: 'authorization_code',
      code: params.get('code') as string,
      redirect_uri: this.REDIRECT_URI,
      code_verifier: codeVerifier,
    });
  }

  /**
   * @param params - Params to send with request
   * @returns - Promise with access token as string
   */
  async createAccessToken(params: Record<string, string>): Promise<string> {
    try {
      const response = await this.request('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: this.CLIENT_ID,
          ...params,
        }),
      });

      const accessToken = response.access_token;

      sessionStorage.setItem('tokenSet', JSON.stringify(response));
      console.log(response)

      this.errorEvent.emit(undefined);
      return accessToken;
    } catch (e) {
      console.log('caught:', e);
      this.errorEvent.emit(e as CustomError);
      return '';
    }
  }


  /**
   * @returns Promise<string> - Contains the current tokenset if still valid
   */
  async refreshAccessToken(): Promise<string | null> {
    let tokenSet = JSON.parse(sessionStorage.getItem('tokenSet') as string);

    if (!tokenSet) {
      return null;
    }

    if (tokenSet.expires_at < Date.now()) {
      tokenSet = await this.createAccessToken({
        grant_type: 'refresh_token',
        refresh_token: tokenSet.refresh_token,
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
}
