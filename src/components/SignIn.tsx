import React from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import AutoRenewIcon from '@material-ui/icons/Autorenew'

import { authServlet, AuthServletProps } from '~src/Context/GAPI'

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100vw',
    height: '100vh',
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.paper,
  },
  heading: {
    marginBottom: theme.spacing.unit * 3,
  },
  subHeading: {
    marginBottom: theme.spacing.unit * 5,
  },
  icon: {
    marginRight: theme.spacing.unit,
  },
})

type Props = AuthServletProps & WithStyles<typeof styles>
class SignIn extends React.PureComponent<Props> {
  render () {
    const { classes, authService } = this.props
    return (
      <div className={classes.root}>
        <Typography variant="headline" className={classes.heading}>
          Welcome to the Google Contact APP
        </Typography>
        <Typography variant="subheading" className={classes.subHeading}>
          Created witch stacks: React, TypeScript, Material-ui, Reach-Router
        </Typography>
        {authService ? (
          <Button variant="contained" color="primary" onClick={authService.signIn}>
            <OpenInNewIcon className={classes.icon} />
            Sign in with Google Account
          </Button>
        ) : (
          <Button variant="contained" color="primary">
            <AutoRenewIcon className={classes.icon} />
            Initializing...
          </Button>
        )}
      </div>
    )
  }
}

export default authServlet(withStyles(styles)(SignIn))
