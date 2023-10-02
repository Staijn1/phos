import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {
  faBars as OpenMobileMenuIcon,
  faChartBar,
  faCog,
  faEyeDropper,
  faHome,
  faList,
  faMinus,
  faPlus,
  faPowerOff,
  faRunning,
  faSlidersH,
  faTimes as CloseMobileMenuIcon,
  faWalking
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ColorpickerComponent } from '../../shared/components/colorpicker/colorpicker.component';
import { LedstripState } from '@angulon/interfaces';
import { WebsocketService } from '../../services/websocketconnection/websocket.service';
import {
  DecreaseLedstripBrightness,
  DecreaseLedstripSpeed,
  IncreaseLedstripBrightness,
  IncreaseLedstripSpeed
} from '../../../redux/ledstrip/ledstrip.action';
import { OffCanvasComponent } from '../../shared/components/offcanvas/off-canvas.component';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit {
  @ViewChild('mobileMenu') mobileMenu!: OffCanvasComponent;
  @ViewChild('container') navContainer!: ElementRef;
  @ViewChild(ColorpickerComponent) colorpicker!: ColorpickerComponent;
  homeIcon = faHome;
  modeIcon = faList;
  visualizerIcon = faChartBar;
  colorpickerIcon = faEyeDropper;
  mobileMenuIcon = OpenMobileMenuIcon;
  powerOffIcon = faPowerOff;
  controlsIcon = faSlidersH;
  settingsIcon = faCog;
  decreaseBrightnessIcon = faMinus;
  increaseBrightnessIcon = faPlus;
  speedIncreaseIcon = faRunning;
  speedDecreaseIcon = faWalking;
  timeline = gsap.timeline();
  isOpen = false;
  private animationMode = 0;

  constructor(
    public connection: WebsocketService,
    private router: Router,
    private store: Store<{ ledstripState: LedstripState }>
  ) {
  }

  ngOnInit(): void {
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

  turnOff(): void {
    // Animate the off button to become red
    this.timeline.to('#powerOff', { duration: 0.6, color: 'white', background: 'var(--bs-danger)' });
    this.timeline.to('#powerOff', { duration: 1.2, clearProps: 'background,color' });

    this.timeline.to('#powerOffMobile', { duration: 0.6, color: 'white', background: 'var(--bs-danger)' });
    this.timeline.to('#powerOffMobile', { duration: 1.2, clearProps: 'background,color' });

    this.connection.turnOff();
  }

  decreaseBrightness() {
    this.store.dispatch(new DecreaseLedstripBrightness());
  }

  increaseBrightness() {
    this.store.dispatch(new IncreaseLedstripBrightness());
  }

  increaseSpeed() {
    this.store.dispatch(new IncreaseLedstripSpeed());
  }

  decreaseSpeed() {
    this.store.dispatch(new DecreaseLedstripSpeed());
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
