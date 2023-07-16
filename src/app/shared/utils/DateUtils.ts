export class DateUtils {
  public static TimeZone = -3;
}

export const DaysPTBR: [number, string][] = [
  [0, 'Domingo'],
  [1, 'Segunda-feira'],
  [2, 'Terça-feira'],
  [3, 'Quarta-feira'],
  [4, 'Quinta-feira'],
  [5, 'Sexta-feira'],
  [6, 'Sábado'],
];

export function getDayPTBR(day: number) {
  return DaysPTBR[day][1];
}

