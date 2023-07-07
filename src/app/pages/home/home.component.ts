import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Movie } from "../../shared/types/Movie";
import { SessionService } from "../../shared/services/session.service";
import { RoomService } from "../../shared/services/room.service";
import { MovieService } from "../../shared/services/movie.service";
import { MatStepper } from "@angular/material/stepper";
import { Session } from "../../shared/types/Session";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  protected movieList: Movie[] = [];
  protected selectedMovie: Movie = {} as Movie;
  protected movieSessions: Session[];

  @ViewChild("stepper", { static: true }) stepper: MatStepper;

  constructor(private elementRef: ElementRef,
              private movieService: MovieService,
              private roomService: RoomService,
              private sessionService: SessionService,) {
  }

  ngOnInit() {
    this.updateAllLists();
  }

  protected updateAllLists() {
    this.updateMovieList();
  }

  private updateMovieList() {
    this.movieService.list().subscribe(response => {
      this.movieList = response;
    });
  }

  protected setSelectedMovie(movie: Movie) {
    this.selectedMovie = movie;

    this.sessionService.searchByMovieName(movie.name).subscribe((response: Session[]) => {
      this.movieSessions = response;
    });

    this.stepper.next();
  }

  protected isSelectedMovie(): boolean {
    return !!this.selectedMovie;
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
