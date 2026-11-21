import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// "AAAA-MM-DD" is read as a local calendar date so the day never shifts with the time zone.
function toDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
}

export function formatDate(value: string) {
  return format(toDate(value), "d 'de' MMMM, yyyy", { locale: ptBR });
}
export function formatShortDate(value: string) {
  return format(toDate(value), "dd.MM.yyyy");
}
