import React from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import OpenInNew from '@material-ui/icons/OpenInNew'

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
  signInIcon: {
    marginRight: theme.spacing.unit,
  },
})

interface Props extends WithStyles<typeof styles> {
}
class SignIn extends React.PureComponent<Props> {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography variant="headline" className={classes.heading}>
          Welcome to the Google Contact APP
        </Typography>
        <Typography variant="subheading" className={classes.subHeading}>
          Created witch stacks: React, TypeScript, Material-ui, Reach-Router
        </Typography>
        <Button variant="contained" color="primary">
          <OpenInNew className={classes.signInIcon} />
          Sign in with Google Account
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(SignIn)
