enum MSG_TEXT {
  AUTH_UNINITIALIZED,
  AUTH_IS_SIGNING_IN,
  AUTH_IS_SIGNING_OUT,
}
enum UI_TEXT {
  loginButton,
  contacts,
}
export type MessageTextPreset = keyof typeof MSG_TEXT
export type UITextPreset = keyof typeof UI_TEXT

export type DomainPresets = {
  message: {
    [key in MessageTextPreset]: string
  },
  UI: {
    [key in UITextPreset]: string
  },
}

enum LOCALE {
  en,
  zh,
}
export type LocaleName = keyof typeof LOCALE

export type LocalesType = {
  [k in LocaleName ]: DomainPresets
}

export const defaultLocale: LocaleName = 'en'
