import {trigger, transition, style, animate} from '@angular/animations';

export const fade = trigger('fade', [
  transition(':enter', [
    style({opacity: 0}), animate('300ms', style({opacity: 1}))]
  ),
  transition(':leave',
    [style({opacity: 1}), animate('300ms', style({opacity: 0}))]
  )
]);

/**
 * An animation that makes an element slide in from the right, while increasing its opacity.
 * When the element is removed, it slides out to the right and decreases its opacity.
 */
export const swipeRight = trigger('swipeRight', [
  transition(':enter', [
    style({transform: 'translateX(100%)', opacity: 0}),
    animate('300ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'translateX(0)', opacity: 1}),
    animate('300ms ease-out', style({transform: 'translateX(100%)', opacity: 0}))
  ])
]);
