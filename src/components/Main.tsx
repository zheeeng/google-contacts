import React from 'react'
import classNames from 'classnames'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Divider from '@material-ui/core/Divider'

import { authServlet, AuthServletProps } from '~src/Context/GAPI'
import AppSideBar, { drawerWidth } from './AppSideBar'
import AppSearch from './AppSearch'
import { localize, LocalizeProps  } from '~src/Context/Locale'

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100vw',
    height: '100vh',
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    zIndex: 1201,
  },
  appSearch: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShiftLeft: {
    marginLeft: 0,
  },
  drawerExpander: {
    marginRight: theme.spacing.unit * 2,
  },
})

type Props = AuthServletProps & LocalizeProps & WithStyles<typeof styles>
interface State {
  drawerOpen: boolean,
  accountMenuAnchorEl?: HTMLElement,
}

export class Main extends React.Component<Props, State> {
  state = {
    drawerOpen: true,
    accountMenuAnchorEl: undefined,
  }

  private handleDrawerToggle = () => {
    this.setState(state => ({ ...state, drawerOpen: !state.drawerOpen }))
  }
  private handleAccountMenuClick = (event: any) => {
    event.persist()

    this.setState(state => ({ ...state, accountMenuAnchorEl: event.target }))
  }
  private handleAccountMenuClose = () => {
    this.setState(state => ({
      ...state,
      accountMenuAnchorEl: undefined,
    }))
  }
  private handleLanguageChangeClick = (locale: string) => () => {
    this.setState(
      state => ({
        ...state,
        accountMenuAnchorEl: undefined,
      }),
      () => { this.props.changeLocale && this.props.changeLocale(locale) },
    )
  }
  private handleSignOutClick = () => {
    this.setState(
      state => ({
        ...state,
        accountMenuAnchorEl: undefined,
      }),
      () => { this.props.authService.signOut() },
    )
  }

  private renderAppBar = () => {
    const { classes } = this.props

    return (
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={this.handleDrawerToggle}
          className={classes.drawerExpander}
        >
          <MenuIcon />
        </IconButton>
        <Hidden smDown implementation="css">
          <Typography variant="headline" color="inherit" noWrap>
            Google Contacts
          </Typography>
        </Hidden>
        <AppSearch className={classes.appSearch}/>
        <div>
          <IconButton
            onClick={this.handleAccountMenuClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={this.state.accountMenuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={!!this.state.accountMenuAnchorEl}
            onClose={this.handleAccountMenuClose}
          >
            <MenuItem onClick={this.handleLanguageChangeClick('zh')}>
              中文
            </MenuItem>
            <MenuItem onClick={this.handleLanguageChangeClick('en')}>
              English
            </MenuItem>
            <Divider />
            <MenuItem onClick={this.handleSignOutClick}>
              Sign Out
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    )
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          {this.renderAppBar()}
        </AppBar>
        <AppSideBar
          open={this.state.drawerOpen}
          onClose={this.handleDrawerToggle}
        />
        <main className={classNames(classes.content, !this.state.drawerOpen && classes.contentShiftLeft)}>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default withStyles(styles)(localize(authServlet(Main)))
