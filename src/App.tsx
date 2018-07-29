import React from 'react'
import { Router, Redirect } from '@reach/router'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'

import {
  servletHub,
  AuthServletProps,
} from '~src/Context/GAPI'
import { provideLocales, localize } from '~src/Context/Locale'

import Main from '~src/components/Main'
import SignIn from '~src/components/SignIn'

interface Props extends AuthServletProps {}

const theme = createMuiTheme({
  palette: {
    primary: indigo,
  },
})

const Fallback = () => <div>Fallback</div>

class App extends React.Component<Props> {

  private renderAuthOrMain () {
    return this.props.authService && !this.props.authService.isSignedIn
      ? (
        <Router>
          <Redirect noThrow from="*" to="/sign-in" />
          <SignIn path="/sign-in" />
        </Router>
      ) : (
        <Router>
          <Main path="/" />
          <Fallback default />
        </Router>
      )
  }

  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {this.renderAuthOrMain()}
      </MuiThemeProvider>
    )
  }
}

export default provideLocales(localize(servletHub(App)))
