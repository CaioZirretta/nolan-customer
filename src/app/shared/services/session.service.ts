import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateReservation, Session } from "../types/Session";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private url: string = 'http://localhost:3333/session';
  private headers: Record<string, HttpHeaders> = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient) { }

  list(): Observable<Session[]>{
    return this.httpClient.get<Session[]>(this.url, this.headers);

  }

  searchById(id: string): Observable<Session[]>{
    return this.httpClient.get<Session[]>(`${this.url}/?id=${id}`, this.headers);

  }

  searchByRoom(roomNumber: number): Observable<Session[]>{
    return this.httpClient.get<Session[]>(`${this.url}/room/?roomNumber=${roomNumber}`, this.headers);
  }

  searchByMovieName(name: string): Observable<Session[]>{
    return this.httpClient.get<Session[]>(`${this.url}/movie/?movieName=${name}`)
  }

  newReservation(reservation: CreateReservation): Observable<Session> {
    return this.httpClient.post<Session>(`${this.url}/reservation/`, reservation, this.headers);
  }
}
