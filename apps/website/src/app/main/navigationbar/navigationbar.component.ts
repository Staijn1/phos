import {AfterViewInit, Component, EventEmitter, OnInit, Output, Renderer2} from '@angular/core'
import {faSquare} from '@fortawesome/free-regular-svg-icons'
import {TimelineLite, gsap} from 'gsap'
import {NavigationEnd, NavigationStart, Router} from '@angular/router'

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
  faWalking,
  faWindowMinimize
} from '@fortawesome/free-solid-svg-icons'
import {ConnectionService} from '../../services/connection/connection.service'

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit, AfterViewInit {
  cog = faCog;
  home = faHome;
  mode = faList;
  visualizer = faChartBar;
  colorpicker = faEyeDropper;
  mobileMenu = faBars;
  isOpen = false;
  minimize = faWindowMinimize;
  maximize = faSquare;
  exit = faTimes;
  powerOff = faPowerOff;
  controls = faSlidersH;
  settings = faCog;
  decreaseBrightnessIcon = faMinus;
  increaseBrightnessIcon = faPlus;
  speedIncreaseIcon = faRunning;
  speedDecreaseIcon = faWalking;
  editor = faEdit
  visualizer3D = faCubes;
  // private window: Electron.BrowserWindow | undefined;
  private animationMode = 0;
  private timeline!: TimelineLite;

  @Output() animationEnd = new EventEmitter<void>();


  constructor(
    public connection: ConnectionService,
    private router: Router,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      // When the user starts to navigate to a new page, immediately show the cover again otherwise content will already be visible.
      if(val instanceof NavigationStart){
        gsap.set('#cover', {autoAlpha: 1, duration: 0})
      }
      if (val instanceof NavigationEnd) {
        this.animate()
        this.closeMobileMenu()
      }
    })
  }

  ngAfterViewInit(): void {
    this.animate()
  }

  mobileNav(): void {
    if (!this.isOpen) {
      this.openMobileMenu()
    } else {
      this.closeMobileMenu()
    }
  }

  private closeMobileMenu() {
    this.mobileMenu = faBars
    this.renderer.removeClass(document.body, 'mobile-nav-active')
    this.isOpen = false
  }

  private openMobileMenu() {
    this.mobileMenu = faTimes
    this.renderer.addClass(document.body, 'mobile-nav-active')
    this.isOpen = true
  }

  private animationFromLeft(anime: TimelineLite): TimelineLite {
    anime.to('.from-left .tile', {
      duration: 0.4,
      width: '100%',
      left: '0%',
      delay: 0.2,
      stagger: 0.05,
    })
    anime.to('.from-left .tile', {
      duration: 0.4,
      width: '100%',
      left: '100%',
      delay: 0.2,
      stagger: -0.05,
    })
    anime.set('.from-left .tile', {left: '0', width: '0'})

    return anime
  }

  private animate(): void {
    // Animate the cover to fade out, revealing the page.
    gsap.to('#cover', {
      ease: 'power4.inOut',
      alpha: 1,
    })

    this.timeline = new TimelineLite({
      defaults: {
        ease: 'power4.inOut'
      },
      onComplete: () => {
        this.fireEvent()
      }
    })

    switch (this.animationMode) {
      case 0:
        this.animateFromTop(this.timeline)
        break
      case 1:
        this.animationFromLeft(this.timeline)
        break
    }

    this.animationMode = ++this.animationMode % 2
  }

  private animateFromTop(anime: TimelineLite): TimelineLite {
    anime.to('.from-top .tile', {
      duration: 0.4,
      height: '100%',
      top: '0%',
      delay: 0,
      stagger: 0.05,
    }).to('.from-top .tile', {
      duration: 0.4,
      height: '100%',
      top: '100%',
      delay: 0,
      stagger: -0.05,
    }).set('.from-top .tile', {top: '0', height: '0'})
    return anime
  }

  private fireEvent(): void {
    const anime: TimelineLite = new TimelineLite()
    anime.to('#cover', {
      duration: 0.8,
      autoAlpha: 0,
      ease: 'power2.inOut'
    })
    this.animationEnd.emit()
  }

  turnOff(): void {
    this.timeline
      .to('#powerOff', 0.6, {color: 'white', background: 'var(--bs-danger)'})
      .to('#powerOff', 1.2, {clearProps: 'background,color'})

    this.connection.setColor(['#000000', '#000000', '#000000'])
    this.connection.setMode(0)
  }
}
