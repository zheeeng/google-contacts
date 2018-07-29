if (process.env.REACT_APP_GOOGLE_APP_KEY
  && process.env.REACT_APP_GOOGLE_CLIENT_ID) return

const Colors = {
  Reset: 0,
  Bright: 1,
  Dim: 2,
  Underscore: 4,
  Blink: 5,
  Reverse: 7,
  Hidden: 8,
  FgBlack: 30,
  FgRed: 31,
  FgGreen: 32,
  FgYellow: 33,
  FgBlue: 34,
  FgMagenta: 35,
  FgCyan: 36,
  FgWhite: 37,
  BgBlack: 40,
  BgRed: 41,
  BgGreen: 42,
  BgYellow: 43,
  BgBlue: 44,
  BgMagenta: 45,
  BgCyan: 46,
  BgWhite: 47
}

function makeColorRender (text, colorNumber = Colors.FgBlue) {
  return `\x1b[1m\x1b[${colorNumber}m${text}\x1b[0m`
}

process.stdout.write(`Please providing the webpack with Your Google API KEY and the corresponding Google Client ID as environment variables:
`)

process.stdout.write(`${makeColorRender(
  'REACT_APP_GOOGLE_APP_KEY', Colors.FgRed,
)}=${makeColorRender(
  '<YOUR_GOOGLE_APP_KEY>', Colors.FgBlue,
)} `)

process.stdout.write(`${makeColorRender(
  'REACT_APP_GOOGLE_CLIENT_ID', Colors.FgRed,
)}=${makeColorRender(
  '<YOUR_GOOGLE_CLIENT_ID>', Colors.FgBlue,
)} `)

process.stdout.write(`${makeColorRender(
  '<NPM_SCRIPT_CLI>', Colors.FgGreen,
)}

`)

process.exit(1)
