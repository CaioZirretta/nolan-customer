export type Session = {
  id?: string
  roomNumber: number
  sits: string[]
  time: Date
  movieId: string,
  movieName: string,
  createdAt?: Date
  updatedAt?: Date
}

export type SessionsByDay = {
  day: Date | string,
  sessions: Session[]
}

export type CreateReservation = {
  sessionId: string,
  sits: string[]
}
