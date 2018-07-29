import React from 'react'
import classNames from 'classnames'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ContactsIcon from '@material-ui/icons/Contacts'
import UpdateIcon from '@material-ui/icons/Update'
import FilterNoneIcon from '@material-ui/icons/FilterNone'
import LabelIcon from '@material-ui/icons/Label'
import FeedbackIcon from '@material-ui/icons/Feedback'
import HelpIcon from '@material-ui/icons/Help'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/SettingsApplications'
import AccountCircle from '@material-ui/icons/AccountCircle'

const drawerWidth = 260

const baseItems = (
  <>
    <ListItem button>
      <ListItemIcon>
        <ContactsIcon />
      </ListItemIcon>
      <ListItemText secondary="Contacts" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <UpdateIcon />
      </ListItemIcon>
      <ListItemText secondary="Frequently contacted" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <FilterNoneIcon />
      </ListItemIcon>
      <ListItemText secondary="Duplicates" />
    </ListItem>
  </>
)

const labelItems = (
  <>
    <ListItem button>
      <ListItemIcon>
        <LabelIcon />
      </ListItemIcon>
      <ListItemText secondary="Label" />
    </ListItem>
  </>
)

const moreItems = (
  <>
    <ListItem button>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText secondary="Settings" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <FeedbackIcon />
      </ListItemIcon>
      <ListItemText secondary="Send feedback" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <HelpIcon />
      </ListItemIcon>
      <ListItemText secondary="Help" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText secondary="Switch to the old version" />
    </ListItem>
  </>
)

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
  toolbar: theme.mixins.toolbar,
  appBar: {
    zIndex: 1201,
  },
  headline: {
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
    display: 'flex',
    flexDirection: 'row',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShiftLeft: {
    marginLeft: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: theme.spacing.unit,
  },
  drawerExpander: {
    marginRight: theme.spacing.unit * 2,
  },
})

interface Props extends WithStyles<typeof styles> {}
interface State {
  drawerOpen: boolean,
  accountMenuAnchorEl?: HTMLElement,
}

export class Main extends React.PureComponent<Props, State> {
  state = {
    drawerOpen: true,
    accountMenuAnchorEl: undefined,
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ ...state, drawerOpen: !state.drawerOpen }))
  }
  handleAccountMenuClick = (event: any) => {
    event.persist()

    this.setState(state => ({ ...state, accountMenuAnchorEl: event.target }))
  }
  handleAccountMenuClose = () => {
    this.setState(state => ({ ...state, accountMenuAnchorEl: undefined }))
  }

  private renderAppBar () {
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
        <Typography variant="headline" color="inherit" className={classes.headline} noWrap>
          Google Contacts
        </Typography>
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
            <MenuItem onClick={this.handleAccountMenuClose}>
              Language
            </MenuItem>
            <MenuItem onClick={this.handleAccountMenuClose}>
              Sign Out
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    )
  }

  private renderDrawerContent (isMobile: boolean = false) {
    const { classes } = this.props

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>{baseItems}</List>
        <Divider />
        <List>{labelItems}</List>
        <Divider />
        <List>{moreItems}</List>
      </div>
    )

    return (
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={this.state.drawerOpen}
        onClose={this.handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={isMobile ? { keepMounted: true } : undefined}
      >
        {drawer}
      </Drawer>
    )
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          {this.renderAppBar()}
        </AppBar>
        <Hidden mdUp>
          {this.renderDrawerContent(true)}
        </Hidden>
        <Hidden smDown implementation="css">
          {this.renderDrawerContent()}
        </Hidden>
        <main className={classNames(classes.content, !this.state.drawerOpen && classes.contentShiftLeft)}>
          <div className={classes.toolbar} />
          <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>
        </main>
      </div>
    )
  }
}

export default withStyles(styles as any, { withTheme: true })(Main)
