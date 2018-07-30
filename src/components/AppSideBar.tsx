import React from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import { navigate } from '@reach/router'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'
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
import AddIcon from '@material-ui/icons/Add'
import UpIcon from '@material-ui/icons/KeyboardArrowUp'
import DownIcon from '@material-ui/icons/KeyboardArrowDown'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Zoom from '@material-ui/core/Zoom'

import { groupServlet, GroupServletProps, Label } from '~src/Context/GAPI'

export const drawerWidth = 260

const styles = (theme: Theme) => createStyles({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    padding: theme.spacing.unit,
  },
  nestedItems: {
    paddingLeft: theme.spacing.unit * 2,
  },
})

type Props = GroupServletProps & WithStyles<typeof styles> & {
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

const convertLabelToLabelItem = (label: Label) => ({
  icon: <LabelIcon />,
  path: `/label/${label.resourceName}`,
  labelText: label.name,
})

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

interface State {
  newLabelName: string,
  labelMenuOpen: boolean,
  createLabelDialogOpen: boolean,
}

export class AppSideBar extends React.PureComponent<Props, State> {

  state = {
    newLabelName: '',
    labelMenuOpen: true,
    createLabelDialogOpen: false,
  }

  private toggleLabelMenuOpen = () => {
    this.setState(state => ({ ...state, labelMenuOpen: !state.labelMenuOpen }))
  }

  private openCreateLabelDialog = () => {
    this.setState(state => ({
      ...state,
      createLabelDialogOpen: true,
      newLabelName: '',
    }))
  }

  private closeCreateLabelDialog = () => {
    this.setState(state => ({
      ...state,
      createLabelDialogOpen: false,
      newLabelName: '',
    }))
  }

  private handleNewLabelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.setState(state => ({ ...state, newLabelName: value }))
  }

  private submitNewLabel = () => {
    const newLabelName = this.state.newLabelName
    this.setState(state => ({
      ...state,
      createLabelDialogOpen: false,
      newLabelName: '',
    }))

    // this.props.groupService.groupApi.createGroup({
    //   label: newLabelName,
    // })
  }

  private goTo = (path: string) => () => {
    navigate(path)
  }

  private renderExpandableLabels = () =>
    (
      <ListItem button onClick={this.toggleLabelMenuOpen}>
        <ListItemIcon>
          {this.state.labelMenuOpen ? <UpIcon /> : <DownIcon />}
        </ListItemIcon>
        <ListItemText secondary="Labels" />
      </ListItem>
    )

  private renderCreateLabelItem = () =>
    (
      <ListItem button onClick={this.openCreateLabelDialog}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText secondary="Create Label" />
      </ListItem>
    )

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
        <List>
          {this.renderExpandableLabels()}
          <Collapse in={this.state.labelMenuOpen} timeout="auto" unmountOnExit>
            <List
              disablePadding
              className={this.props.classes.nestedItems}
            >
              {this.props.groupService.labels
                .map(convertLabelToLabelItem)
                .map(this.renderDrawerItem)
              }
            </List>
          </Collapse>
          {this.renderCreateLabelItem()}
        </List>
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

  private renderCreateLabelDialog = () => (
    <Dialog
      open={this.state.createLabelDialogOpen}
      onClose={this.closeCreateLabelDialog}
      TransitionComponent={Zoom}
    >
      <DialogTitle>创建联系人</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Label"
          type="text"
          value={this.state.newLabelName}
          onChange={this.handleNewLabelNameChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={this.closeCreateLabelDialog} color="primary">
          取消
        </Button>
        <Button variant="contained" color="primary" onClick={this.submitNewLabel}>
          提交
        </Button>
      </DialogActions>
    </Dialog>
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
        {this.renderCreateLabelDialog()}
      </>
    )
  }

  componentDidMount () {
    this.props.groupService.fetchGroups()
  }
}

export default groupServlet(withStyles(styles)(AppSideBar))
