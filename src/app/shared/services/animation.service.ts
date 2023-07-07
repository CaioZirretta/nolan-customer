import { Injectable } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  static fadeIn(timer: number = 1000) {
    return trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate(`${timer}ms cubic-bezier(0.645, 0.045, 0.355, 1)`, style({ opacity: 1 }))
      ])
    ]);
  }
  static riseUp(timer: number = 1000) {
    return trigger("riseUp", [
      state('void', style({ opacity: 0, transform: 'translateY(2rem)' })),
      transition(':enter, :leave', [
        animate(`${timer}ms cubic-bezier(0.645, 0.045, 0.355, 1)`, style({ opacity: 1, transform: 'translateY(0)'}))
      ])
    ])
  }
}
