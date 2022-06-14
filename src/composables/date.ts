const dateOptions = {
  hour: undefined,
  minute: undefined,
  second: undefined,
  weekday: undefined,
  day: 'numeric',
  month: 'numeric',
  year: '2-digit',
}
const datetimeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  second: undefined,
  weekday: undefined,
  day: 'numeric',
  month: 'numeric',
  year: '2-digit',
}

export function dateToString(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('ru-RU', dateOptions)
}

export function datetimeToString(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('ru-RU', datetimeOptions)
}
