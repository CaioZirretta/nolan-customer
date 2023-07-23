import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CreateReservation } from "../../types/Session";
import { catchError, throwError } from "rxjs";
import { SessionService } from "../../services/session.service";
import { UpdateService } from "../../services/update.service";

@Component({
  selector: 'app-new-reservation-dialog',
  templateUrl: './new-reservation-dialog.component.html',
  styleUrls: ['./new-reservation-dialog.component.css']
})
export class NewReservationDialogComponent {
  protected errorMessage = "";

  constructor(private sessionService:SessionService,
              public dialogRef: MatDialogRef<NewReservationDialogComponent>,
              private updateService: UpdateService,
              @Inject(MAT_DIALOG_DATA) public reservation: CreateReservation) {}

  protected newReservation(){
    this.errorMessage = ""

    this.sessionService.newReservation(this.reservation).pipe(
      catchError(error => {
        return throwError(error);
      })
    ).subscribe(() => {
      this.updateService.updateList.emit();
      this.dialogRef.close();
    });
  }

  protected cancel() {
    this.dialogRef.close();
  }
}
