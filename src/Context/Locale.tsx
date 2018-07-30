import React from 'react'
import { DomainPresets, LocaleName, LocalesType, defaultLocale } from './locale.interface'
import en from '~src/config/locale-en'
import zh from '~src/config/locale-zh'

type Store = LocalesType & {
  currentLocale: LocaleName,
  local: DomainPresets,
  changeLocale: (locale: string) => void,
}

interface State {
  currentLocale: LocaleName,
}

const availableLocales: LocalesType = { en, zh }

const { Provider, Consumer} = React.createContext<Store>({
  ...availableLocales,
  currentLocale: defaultLocale,
  local: availableLocales[defaultLocale],
  changeLocale: () => {/**/},
})

export {
  Consumer,
}

export function provideLocales<P> (Component: React.ComponentType<P>) {
  const displayName = `LocaleProviderComponent(${Component.displayName || Component.name || 'Component'})`

  return class ProvidedLocaleComponent extends React.PureComponent<P, State> {
    static displayName = displayName

    state = {
      currentLocale: defaultLocale,
    }

    private get locales (): Store {
      return {
        ...availableLocales,
        currentLocale: this.state.currentLocale,
        local: availableLocales[this.state.currentLocale],
        changeLocale: this.changeLocale,
      }
    }

    private changeLocale = (locale: string) => {
      if (availableLocales.hasOwnProperty(locale)) {
        this.setState(state => ({ ...state, currentLocale: locale as LocaleName }))
      }
    }

    render () {
      const locales = this.locales
      return (
        <Provider value={locales}>
          <Component {...this.props} />
        </Provider>
      )
    }

  }
}

export type LocalizeProps = {
  local: DomainPresets,
  changeLocale: (locale: string) => void,
}

export function localize<P extends LocalizeProps> (
  Component: React.ComponentType<P>,
) {
  const displayName = `InjectedServiceComponent(${Component.displayName || Component.name || 'Component'})`

  return class LocalizedComponent extends React.PureComponent<Omit<P, keyof LocalizeProps>> {
    static displayName = displayName

    render () {
      return (
        <Consumer>
          {({ local, changeLocale }) => (
            <Component {...this.props} local={local} changeLocale={changeLocale} />
          )}
        </Consumer>
      )
    }
  }
}
