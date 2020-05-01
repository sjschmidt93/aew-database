export function formatDate(dateStr: string) {
  return new Date(dateStr).toDateString().split(' ').slice(1).join(' ')
}