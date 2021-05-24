import {Component, OnDestroy, OnInit} from '@angular/core';
import {StaticState} from '../../services/chromaEffect/state/static-state/static-state';
import {ChromaEffectService} from '../../services/chromaEffect/chroma-effect.service';
import {BlinkState} from '../../services/chromaEffect/state/blink-state/blink-state';
import {SingleDynamicState} from '../../services/chromaEffect/state/single-dynamic-state/single-dynamic-state';
import {MultiDynamicState} from '../../services/chromaEffect/state/multi-dynamic-state/multi-dynamic-state';
import {RainbowState} from '../../services/chromaEffect/state/rainbow-state/rainbow-state';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Fire2012State} from '../../services/chromaEffect/state/fire2012-state/fire2012-state';
import {WaterfallState} from '../../services/chromaEffect/state/waterfall-state/waterfall-state';
import {TheaterChaseState} from '../../services/chromaEffect/state/theater-chase-state/theater-chase-state';
import {RainbowCycleState} from '../../services/chromaEffect/state/rainbow-cycle-state/rainbow-cycle-state';
import {ConnectionService} from '../../services/connection/connection.service';
import {ModeInformation} from '../../types/ModeInformation';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.scss'],
})
export class ModeComponent implements OnInit, OnDestroy {
  modes: ModeInformation | undefined;
  chromaEffects = [
    {name: 'Rainbow', state: new RainbowState()},
    {name: 'Rainbow Cycle', state: new RainbowCycleState()},
    {name: 'Multi Dynamic', state: new MultiDynamicState()},
    {name: 'Single Dynamic', state: new SingleDynamicState()},
    {name: 'Blink', state: new BlinkState()},
    {name: 'Theater chase', state: new TheaterChaseState()},
    {name: 'Fire2012', state: new Fire2012State()},
    {name: 'Waterfall', state: new WaterfallState()},
  ];
  classes = ['iconbox-primary', 'iconbox-orange', 'iconbox-pink', 'iconbox-yellow', 'iconbox-red', 'iconbox-teal'];
  selectedMode = 0;

  constructor(
    private readonly connection: ConnectionService,
    private readonly chromaService: ChromaEffectService) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnDestroy(): void {
    this.modes = undefined;
  }

  ngOnInit(): void {
    const anim = gsap.to('.fade-up', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut',
      paused: true
    });

    ScrollTrigger.create({
      trigger: '.fade-up',
      start: 'top bottom',
      onEnter: () => anim.play()
    });

    ScrollTrigger.create({
      trigger: '.fade-up',
      start: 'top bottom',
      onLeaveBack: () => anim.pause(0)
    });

    this.connection.getModes().then(modes => {
      this.modes = modes;
    });
  }


  onChangeSegment($event: MouseEvent): void {
    const id = parseInt(($event.currentTarget as HTMLElement).id, 10);
    this.selectedMode = id + 1;
    this.connection.setMode(id);

    const state = this.chromaEffects.find(stateToCompare => {
      return stateToCompare.name.toLowerCase() === this.modes[id].name.toLowerCase();
    });

    this.chromaService.state = state === undefined ? new StaticState() : state.state;
  }
}
