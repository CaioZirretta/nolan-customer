import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Movie } from "../../shared/types/Movie";
import { SessionService } from "../../shared/services/session.service";
import { RoomService } from "../../shared/services/room.service";
import { MovieService } from "../../shared/services/movie.service";
import { MatStepper } from "@angular/material/stepper";
import { Session, SessionsByDay } from "../../shared/types/Session";
import { DateUtils, getDayPTBR } from "../../shared/utils/DateUtils";
import { Sits } from "../../shared/constants/Sits";
import { catchError, throwError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import {
  NewReservationDialogComponent
} from "../../shared/components/new-reservation-dialog/new-reservation-dialog.component";
import { UpdateService } from "../../shared/services/update.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  protected movieList: Movie[];
  protected selectedMovie: Movie;
  protected selectedMovieSessions: SessionsByDay[];
  protected selectedSession: Session;
  protected selectedSits: Record<string, boolean | 'blocked'>;

  @ViewChild("stepper", { static: true }) stepper: MatStepper;

  constructor(public dialog: MatDialog,
              private elementRef: ElementRef,
              private movieService: MovieService,
              private roomService: RoomService,
              private sessionService: SessionService,
              private updateService: UpdateService) {
  }

  ngOnInit() {
    this.updateAllLists();

    this.updateService.updateList.subscribe(() => {
      this.updateAllLists();
      this.stepper.reset();
    });
  }

  protected updateAllLists(): void {
    this.updateMovieList();
    this.selectedMovie = {} as Movie;
    this.selectedMovieSessions = [];
    this.selectedSession = {} as Session;
    this.selectedSits = {};
  }

  private updateMovieList(): void {
    this.movieService.list().subscribe(response => {
      this.movieList = response;
    });
  }

  protected isSeatBlocked(sit: string): boolean {
    return this.selectedSits[sit] && this.selectedSits[sit] !== 'blocked';
  }

  protected setSelectedMovie(movie: Movie): void {
    this.selectedMovie = movie;

    this.sessionService.searchByMovieName(movie.name).subscribe((response: Session[]): void => {
      this.selectedMovieSessions = this.groupByDay(response);
      this.stepper.next();
    });
  }

  protected setSelectedSession(session: Session): void {
    this.selectedSession = session;

    this.selectedSits = Sits;

    this.selectedSession.sits.forEach(sit => {
      this.selectedSits[sit] = 'blocked';
    });

    this.stepper.next();
  }

  protected toggleSelectedSit(sit: any, s: Event): void {
    if (this.selectedSits[sit] === 'blocked') return;

    if (this.selectedSits[sit]) {
      (s.target! as HTMLElement).classList.remove('occupied');
      this.selectedSits[sit] = false;
      return;
    }

    (s.target! as HTMLElement).classList.add('occupied');
    this.selectedSits[sit] = true;
  }

  protected isMovieSelected(): boolean {
    return !!this.selectedMovie.id;
  }

  protected isSessionSelected(): boolean {
    return !!this.selectedSession.id;
  }

  protected isSitsSelected(): boolean {
    return Object.values(this.selectedSits).includes(true);
  }

  protected groupByDay(sessions: Session[]): SessionsByDay[] {
    const today: Date = new Date();

    const nextDays = [1, 2, 3, 4, 5, 6, 7]
      .map(day =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + day)
      );

    const grouped: SessionsByDay[] = nextDays.map((day: Date) => {
      return {
        day: day.toLocaleDateString(),
        sessions: sessions.filter((session: Session) => {
            const sessionDate = new Date(session.time);
            return (sessionDate.getDate() === day.getDate() &&
              sessionDate.getMonth() === day.getMonth() &&
              sessionDate.getFullYear() === day.getFullYear());
          }
        )
      };
    });

    return grouped;
  }

  protected formatDateToTimeView(date: Date): string {
    const dateObject = new Date(date);

    const hours = (dateObject.getHours() + DateUtils.TimeZone).toString().padStart(2, "0");
    const minutes = (dateObject.getMinutes()).toString().padStart(2, "0");

    const timeView: string = `${hours}:${minutes}`;
    return timeView;
  }

  protected formatDateToDayMonthView(date: string | Date): string {
    return (date as string).slice(0, 5);
  }

  protected formatDateToRevisionView(date: string | Date): string {
    const dateFormatted: Date = new Date(date);
    const weekDay: string = getDayPTBR(dateFormatted.getDay());
    const day: number = dateFormatted.getDate();
    const month: string = (dateFormatted.getMonth() + 1).toString().padStart(2, '0');
    const hours: number = dateFormatted.getHours() + DateUtils.TimeZone;
    const minutes: number = dateFormatted.getMinutes();

    return `${weekDay}, ${day}/${month} às ${hours}:${minutes}`;
  }

  protected selectedSitsToList(): string[] {
    const list: string[] = [];

    Object.keys(this.selectedSits).forEach(sit => {
      if (this.selectedSits[sit] == true) {
        list.push(sit);
      }
    });

    return list;
  }

  protected newReservation(): void {
    const sessionId: string = this.selectedSession.id!;
    const sits: string[] = this.selectedSitsToList();

    const dialogRef = this.dialog.open(NewReservationDialogComponent,
      { data: { sessionId, sits } }
    );

    this.lockBody();

    dialogRef.afterClosed().subscribe((response) => {
      this.unlockBody();
    });

  }

  protected objectKeys(object: Object = Sits): string[] {
    return Object.keys(object);
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
