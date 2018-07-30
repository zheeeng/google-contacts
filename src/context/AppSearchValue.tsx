import React from 'react'

type Context = {
  searchValue: string,
  changeSearchValue: (v: string) => void,
}

const { Provider, Consumer} = React.createContext<Context>({
  searchValue: '',
  changeSearchValue: () => {/**/},
})

export {
  Provider as AppSearchValueProvider,
  Consumer as AppSearchValueConsumer,
}

export default class AppSearchValue extends React.PureComponent<any, { searchValue: string }> {
  state = {
    searchValue: '',
  }

  changeSearchValue = (searchValue: string) => {
    this.setState(state => ({ ...state, searchValue }))
  }

  render () {
    return (
      <Provider value={{
        searchValue: this.state.searchValue,
        changeSearchValue: this.changeSearchValue,
      }}>
        {this.props.children}
      </Provider>
    )
  }
}
