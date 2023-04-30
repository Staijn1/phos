import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {gsap} from 'gsap';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';

import {
  faBars,
  faChartBar,
  faCog,
  faCubes,
  faEdit,
  faEyeDropper,
  faHome,
  faList,
  faMinus,
  faPlus,
  faPowerOff,
  faRunning,
  faSlidersH,
  faTimes,
  faWalking
} from '@fortawesome/free-solid-svg-icons';
import {ChromaEffectService} from '../../services/chromaEffect/chroma-effect.service';
import {WebsocketService} from '../../services/websocketconnection/websocket.service';
import {Store} from '@ngrx/store';
import {ColorpickerState} from '../../../redux/color/color.reducer';
import {ColorpickerComponent} from '../../shared/components/colorpicker/colorpicker.component';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit, AfterViewInit {
  @ViewChild('container') navContainer!: ElementRef;
  @ViewChild(ColorpickerComponent) colorpicker!: ColorpickerComponent;
  homeIcon = faHome;
  modeIcon = faList;
  visualizerIcon = faChartBar;
  colorpickerIcon = faEyeDropper;
  mobileMenuIcon = faBars;
  powerOffIcon = faPowerOff;
  controlsIcon = faSlidersH;
  settingsIcon = faCog;
  decreaseBrightnessIcon = faMinus;
  increaseBrightnessIcon = faPlus;
  speedIncreaseIcon = faRunning;
  speedDecreaseIcon = faWalking;
  editorIcon = faEdit;
  visualizer3DIcon = faCubes;
  timeline = gsap.timeline();
  isOpen = false;
  private animationMode = 0;

  constructor(
    public connection: WebsocketService,
    private router: Router,
    private renderer: Renderer2,
    private chromaEffect: ChromaEffectService,
    private store: Store<{ colorpicker: ColorpickerState }>
  ) {
  }

  ngOnInit(): void {
    // When the colorpicker is updated, update the ledstrip colors if the updateLedstrips flag is set to true.
    // Always update the chroma effect colors.
    this.store.select('colorpicker').subscribe((state) => {
      if (state.updateLedstrips) {
        this.connection.setColor(state.colors);
      }
      this.chromaEffect.setColors = state.colors;
    })

    // Subscribe to router events so we can display a page transition animation each time the user navigates to a new page.
    this.router.events.subscribe((val) => {
      // When the user starts to navigate to a new page, immediately show the cover again otherwise content will already be visible.
      if (val instanceof NavigationStart) {
        gsap.set('#cover', {autoAlpha: 1, duration: 0.3});
      }
      if (val instanceof NavigationEnd) {
        this.animate();
        this.closeMobileMenu();
      }
    });
  }

  ngAfterViewInit(): void {
    this.determineColorPickerOrientation()
  }


  mobileNav(): void {
    if (!this.isOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  turnOff(): void {
    this.timeline.to('#powerOff', {duration: 0.6, color: 'white', background: 'var(--bs-danger)'});
    this.timeline.to('#powerOff', {duration: 1.2, clearProps: 'background,color'});

    this.connection.setColor(['#000000', '#000000', '#000000']);
    this.connection.setMode(0);
  }

  private closeMobileMenu() {
    this.mobileMenuIcon = faBars;
    this.renderer.removeClass(this.navContainer.nativeElement, 'mobile-nav-active');
    this.isOpen = false;
  }

  private openMobileMenu() {
    this.mobileMenuIcon = faTimes;
    this.renderer.addClass(this.navContainer.nativeElement, 'mobile-nav-active');
    this.isOpen = true;
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
    gsap.set('.from-left .tile', {left: '0', width: '0'});
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

    this.timeline.to('#cover', {duration: 0.6, autoAlpha: 0, ease: 'power4.inOut'});
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
    gsap.set('.from-top .tile', {top: '0', height: '0'});
  }

  /**
   * This function changes the orientation of the colorpicker depending on the screen size.
   * If the screen is smaller than 992px (lg breakpoint in Bootstrap 5), the colorpicker will be vertical.
   */
  determineColorPickerOrientation() {
    if (screen.width < 992) {
      this.colorpicker.changeOrientation('vertical');
    } else {
      this.colorpicker.changeOrientation('horizontal')
    }
  }
}
