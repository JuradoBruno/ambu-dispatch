import {
    animation, transition, animate, style, state
  } from '@angular/animations';
  
  export const fade1 = animation(
    [
        state('show', style({
          opacity: 1
        })),
        state('hide', style({
          opacity: 0,
          'pointer-events': 'none'
        })),
        transition('show => hide', animate('300ms ease-out')),
        transition('hide => show', animate('400ms ease-in'))
      ]
  );