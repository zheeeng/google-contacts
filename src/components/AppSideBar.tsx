import React from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import { navigate } from '@reach/router'
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

type Item = {
  icon: React.ReactElement<any>,
  path: string,
  labelText: string,
}

const baseItems = [
  {
    icon: <ContactsIcon />,
    path: '/contacts',
    labelText: 'Contacts',
  },
  {
    icon: <UpdateIcon />,
    path: '/frequent',
    labelText: 'Frequently contacted',
  },
  {
    icon: <FilterNoneIcon />,
    path: '/duplicates',
    labelText: 'Duplicates',
  },
]

const labelItems = [
  {
    icon: <LabelIcon />,
    path: '/label',
    labelText: 'label',
  },
]

const moreItems = [
  {
    icon: <SettingsIcon />,
    path: '/settings',
    labelText: 'Settings',
  },
  {
    icon: <FeedbackIcon />,
    path: '/feedback',
    labelText: 'Send feedbacks',
  },
  {
    icon: <HelpIcon />,
    path: '/help',
    labelText: 'Help',
  },
  {
    icon: <ExitToAppIcon />,
    path: '/old',
    labelText: 'Switch to the old version',
  },
]

export class AppSideBar extends React.PureComponent<Props> {

  private goTo = (path: string) => () => {
    navigate(path)
  }

  private renderDrawerItem = (item: Item) =>
    (
      <ListItem button key={item.path} onClick={this.goTo(item.path)}>
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText secondary={item.labelText} />
      </ListItem>
    )

  private renderDrawer = () =>
    (
      <>
        <div className={this.props.classes.toolbar} />
        <Divider />
        <List>{baseItems.map(this.renderDrawerItem)}</List>
        <Divider />
        <List>{labelItems.map(this.renderDrawerItem)}</List>
        <Divider />
        <List>{moreItems.map(this.renderDrawerItem)}}</List>
      </>
    )

  private renderDrawerContent = (isMobile: boolean = false) =>
    (
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
