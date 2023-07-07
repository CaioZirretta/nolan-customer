import { Component, ElementRef, Input } from '@angular/core';
import { AnimationService } from "../../services/animation.service";
import { Movie } from "../../types/Movie";

@Component({
  selector: 'movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
  animations: [AnimationService.fadeIn(300)]
})
export class MovieCardComponent {
  // @Input({ required: true }) imageSrc: string = "";
  // @Input({ required: true }) title: string = "";
  @Input({ required: true }) movie: Movie;

  constructor(private elementRef: ElementRef) {
  }

  private lockBody() {
    const body = this.elementRef.nativeElement.ownerDocument.body;
    body.style.pointerEvents = 'none';
    body.style.overflow = 'hidden';
  }

  private unlockBody() {
    const body = this.elementRef.nativeElement.ownerDocument.body;
    body.style.pointerEvents = 'all';
    body.style.overflow = 'visible';
  }
}
