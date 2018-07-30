import React from 'react'
import { Router, Redirect } from '@reach/router'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import Typography from '@material-ui/core/Typography'

import {
  servletHub,
  authServlet,
  AuthServletProps,
} from '~src/Context/GAPI'
import { provideLocales, localize, LocalizeProps } from '~src/Context/Locale'

import Main from '~src/components/Main'
import SignIn from '~src/components/SignIn'
import Contacts from '~src/components/Contacts'

type Props = AuthServletProps & LocalizeProps

const theme = createMuiTheme({
  palette: {
    primary: indigo,
  },
})

const Fallback = () => <Typography variant="headline">页面不存在</Typography>
const Frequent = () => <Typography variant="headline">常用联系人</Typography>
const Duplicates = () => <Typography variant="headline">重复联系人</Typography>
const Label = () => <Typography variant="headline">标签</Typography>
const Settings = () => <Typography variant="headline">设置</Typography>
const Feedback = () => <Typography variant="headline">反馈</Typography>
const Help = () => <Typography variant="headline">帮助</Typography>
const Old = () => <Typography variant="headline">旧版 Google Contacts</Typography>

class App extends React.Component<Props> {

  private renderAuthOrMain = () =>
    !this.props.authService || !this.props.authService.isSignedIn
      ? (
        <Router>
          <Redirect noThrow from="*" to="/sign-in" />
          <SignIn path="/sign-in" />
        </Router>
      ) : (
        <Router>
          <Main path="/">
            <Redirect noThrow from="/sign-in" to="/contacts" />
            <Contacts path="/contacts" />
            <Frequent path="/frequent" />
            <Duplicates path="/duplicates" />
            <Label path="/label" />
            <Settings path="/settings" />
            <Feedback path="/feedback" />
            <Help path="/help" />
            <Old path="/old" />
            <Fallback default />
          </Main>
          <Fallback default />
        </Router>
      )

  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {this.renderAuthOrMain()}
      </MuiThemeProvider>
    )
  }
}

export default provideLocales(localize(servletHub(authServlet(App))))
