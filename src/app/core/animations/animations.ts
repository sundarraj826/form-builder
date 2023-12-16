import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
	state('void', style({ opacity: 0 })),
	transition(':enter, :leave', animate(500))
]);
