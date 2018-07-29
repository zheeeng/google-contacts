import React from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
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

export const drawerWidth = 260

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
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    padding: theme.spacing.unit,
  },
})

interface Props extends WithStyles<typeof styles> {
  open: boolean,
  onClose: (event: React.SyntheticEvent<{}>) => void,
}

export class AppSideBar extends React.PureComponent<Props> {

  private renderDrawer () {
    return (
      <>
        <div className={this.props.classes.toolbar} />
        <Divider />
        <List>{baseItems}</List>
        <Divider />
        <List>{labelItems}</List>
        <Divider />
        <List>{moreItems}</List>
      </>
    )
  }

  private renderDrawerContent (isMobile: boolean = false) {
    return (
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={this.props.open}
        onClose={isMobile ? this.props.onClose : undefined}
        classes={{
          paper: this.props.classes.drawerPaper,
        }}
        ModalProps={isMobile ? { keepMounted: true } : undefined}
      >
        {this.renderDrawer()}
      </Drawer>
    )
  }

  render () {
    return (
      <>
        <Hidden mdUp>
          {this.renderDrawerContent(true)}
        </Hidden>
        <Hidden smDown implementation="css">
          {this.renderDrawerContent()}
        </Hidden>
      </>
    )
  }
}

export default withStyles(styles)(AppSideBar)
