import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {MessageService} from '../../services/message-service/message.service';
import {ThemeService} from '../../services/theme/theme.service';
import {Message} from '../../shared/types/Message';
import {swipeRight} from '@angulon/ui';
import * as AOS from 'aos';
import {debounceTime} from 'rxjs';
import {UserPreferences} from '../../shared/types/types';
import {Store} from '@ngrx/store';
import {BaseChromaConnection} from '../../services/chroma-sdk/base-chroma-connection.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {gsap} from 'gsap';
import {OffCanvasComponent} from '../../shared/components/offcanvas/off-canvas.component';
import {faBars as OpenMobileMenuIcon, faTimes as CloseMobileMenuIcon} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  animations: [swipeRight],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('mobileMenu') mobileMenu!: OffCanvasComponent;
  readonly timeline = gsap.timeline();
  private animationMode = 0;

  mobileMenuIcon = OpenMobileMenuIcon;

  constructor(
    public readonly errorService: MessageService,
    private readonly updates: SwUpdate,
    private readonly theme: ThemeService,
    private readonly chromaConnection: BaseChromaConnection,
    private router: Router,
    private readonly store: Store<{
      userPreferences: UserPreferences
    }>) {
    // Subscribe to all changes in the user preferences so we can write the current state to local storage
    store.select('userPreferences')
      .pipe(debounceTime(500))
      .subscribe(preferences => localStorage.setItem('userPreferences', JSON.stringify(preferences)));

    this.theme.initialize();

    // Service worker update, but only in production. During development, the service worker is disabled which results in an error.
    // Enabling the service worker would result in a lot of caching, which is not desired during development because it would be hard to test changes.
    if (updates.isEnabled) {
      updates.checkForUpdate().then((hasUpdate) => {
        if (hasUpdate) {
          this.errorService.setMessage(new Message('info', 'New update available! Click here to update.', () => this.update()));
        }
      });
    }
  }


  /**
   * On resize, check if the screen is still small enough for a mobile menu.
   * If the screen is big and the menu was open, we will close it
   * If the screen turned small and the menu is open, we will open it up
   * @private
   */
  @HostListener('window:resize')
  private closeMobileMenuOnBigScreen(): void {
    if (screen.width > 992 && this.mobileMenu.isOpen) this.mobileMenu.close();
    if (screen.width <= 992 && this.mobileMenu.isOpen) this.mobileMenu.open();
  }

  onMobileMenuChange(isOpen: boolean) {
    this.mobileMenuIcon = isOpen ? CloseMobileMenuIcon : OpenMobileMenuIcon;
  }

  update() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

  onAlertClick(error: Message) {
    if (!error.action) return;
    error.action();
  }

  ngOnInit(): void {
    AOS.init();

    // Subscribe to router events so we can display a page transition animation each time the user navigates to a new page.
    this.router.events.subscribe((val) => {
      // When the user starts to navigate to a new page, immediately show the cover again otherwise content will already be visible.
      if (val instanceof NavigationStart) {
        gsap.set('#cover', { autoAlpha: 1, duration: 0.3 });
      }
      if (val instanceof NavigationEnd) {
        this.animate();
        this.mobileMenu.close();
      }
    });
  }

  private animationFromLeft(): void {
    // First we transform the tiles from the left to the right, staggered.
    this.timeline.to('.from-left .tile', {
      duration: 0.4,
      width: '100%',
      left: '0%',
      delay: 0,
      stagger: 0.05
    });
    // After that animation has finished, we transform the tiles from the right to the left, staggered.
    this.timeline.to('.from-left .tile', {
      duration: 0.4,
      width: '100%',
      left: '100%',
      delay: 0,
      stagger: -0.05
    });
    gsap.set('.from-left .tile', { left: '0', width: '0' });
  }

  private animate(): void {
    // Animate the cover to fade out, revealing the page.

    switch (this.animationMode) {
      case 0:
        this.animateFromTop();
        break;
      case 1:
        this.animationFromLeft();
        break;
    }

    this.timeline.to('#cover', { duration: 0.6, autoAlpha: 0, ease: 'power4.inOut' });
    this.animationMode = ++this.animationMode % 2;
  }

  private animateFromTop(): void {
    // Fist we transform the tiles from the top to the bottom, staggered.
    this.timeline.to('.from-top .tile', {
      duration: 0.4,
      height: '100%',
      top: '0%',
      delay: 0,
      stagger: 0.05
    });
    // After that animation has finished, we transform the tiles from the bottom to the top, staggered.
    this.timeline.to('.from-top .tile', {
      duration: 0.4,
      height: '100%',
      top: '100%',
      delay: 0,
      stagger: -0.05
    });
    gsap.set('.from-top .tile', { top: '0', height: '0' });
  }
}
