export function toast <V> (value: V) {
  // tslint:disable-next-line:no-console
  console.log(value)
  return value
}
export function toastCapture (error: any) {
  // tslint:disable-next-line:no-console
  console.log(error.message || error)
  throw error
}
