import React from 'react'
import { Link } from '@reach/router'
import Button from '@material-ui/core/Button'
import OpenInNew from '@material-ui/icons/OpenInNew'

export default class SignIn extends React.PureComponent {
  render () {
    return (
      <div>
        <h1>Welcome to the Contacts APP</h1>
        <Button variant="contained" color="primary">
          <OpenInNew style={{ marginRight: 8 }} />
          Sign in with Google Account
        </Button>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="dashboard">Dashboard</Link>
        </nav>
      </div>
    )
  }
}
