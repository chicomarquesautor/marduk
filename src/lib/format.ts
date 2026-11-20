import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(iso: string) {
  return format(new Date(iso), "d 'de' MMMM, yyyy", { locale: ptBR });
}
export function formatShortDate(iso: string) {
  return format(new Date(iso), "dd.MM.yyyy");
}
