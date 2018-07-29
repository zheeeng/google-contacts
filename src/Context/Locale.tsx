import React from 'react'
import { DomainPresets, LocaleName, LocalesType, defaultLocale } from './locale.interface'
import en from '~src/config/locale-en'
import zh from '~src/config/locale-zh'

type Store = LocalesType & { currentLocale: LocaleName, local: DomainPresets }

interface State {
  currentLocale: LocaleName,
}

const availableLocales: LocalesType = { en, zh }

const { Provider, Consumer} = React.createContext<Store>({
  ...availableLocales,
  currentLocale: defaultLocale,
  local: availableLocales[defaultLocale],
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

export function localize<P> (
  Component: React.ComponentType<P & { local: DomainPresets }>,
) {
  const displayName = `InjectedServiceComponent(${Component.displayName || Component.name || 'Component'})`

  return class LocalizedComponent extends React.PureComponent<P> {
    static displayName = displayName

    render () {
      return (
        <Consumer>
          {({ local }) => (
            <Component {...this.props} local={local} />
          )}
        </Consumer>
      )
    }
  }
}
