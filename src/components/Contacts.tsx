import React from 'react'
import { connectionServlet, ConnectionServletProps, Person } from '~src/Context/GAPI'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import StarIcon from '@material-ui/icons/Star'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    height: '100%',
    minHeight: 500,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  progress: {
    marginTop: theme.spacing.unit * 4,
  },
  listItem: {
    width: '100%',
    // tslint:disable-next-line:max-line-length
    margin: `${theme.spacing.unit}px -${theme.spacing.unit * 2}px ${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    backgroundColor: theme.palette.background.paper,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
  },
})

type Props = ConnectionServletProps & WithStyles<typeof styles>

interface State {
  toDeleteResourceName: string,
}

class Contacts extends React.PureComponent<Props, State> {
  state = {
    toDeleteResourceName: '',
  }

  private handleToggle = (resourceName: string) => () => {
    //
  }

  private toDeleteContact = (resourceName: string) => () => {
    this.setState(state => ({ ...state, toDeleteResourceName: resourceName }))
  }

  private closeDeletionDialog = ()  => {
    this.setState(state => ({ ...state, toDeleteResourceName: '' }))
  }

  private deleteContact = () => {
    const toDeleteResourceName = this.state.toDeleteResourceName
    if (toDeleteResourceName) {
      this.setState(state => ({ ...state, toDeleteResourceName: '' }))

      this.props.connectionService && this.props.connectionService.deleteContact(toDeleteResourceName)
    }
  }

  private renderContact = (contact: Person) => {
    const email = contact.emailAddresses
    ? contact.emailAddresses[0]
      ? contact.emailAddresses[0].value
      : ''
    : ''
    const name = contact.names
    ? contact.names[0]
      ? contact.names[0].displayName
      : ''
    : ''
    const img = contact.photos
      ? contact.photos[0]
        ? contact.photos[0].url
        : ''
      : ''

    return (
      <ListItem
        key={contact.resourceName!}
        dense
        button
        onClick={this.handleToggle(contact.resourceName!)}
        classes={{
          container: this.props.classes.listItem,
        }}
      >
        <Avatar alt={name} src={img} />
        <ListItemText primary={name} />
        <ListItemText primary={email} />
        <ListItemSecondaryAction>
          <IconButton>
            <StarIcon />
          </IconButton>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton onClick={this.toDeleteContact(contact.resourceName!)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  render () {
    const classes = this.props.classes

    if (!this.props.connectionService) {
      return  <Typography variant="headline">服务初始化...</Typography>
    }

    const connections = this.props.connectionService.connections

    if (!connections.length) {
      return (
        <div className={classes.root}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      )
    }

    return (
      <>
        <List className={classes.root}>
          {connections.map(this.renderContact)}
        </List>
        <Dialog
          open={!!this.state.toDeleteResourceName}
          onClose={this.closeDeletionDialog}
        >
          <DialogTitle>
            确认要删除该联系人吗
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.closeDeletionDialog} color="primary">
              取消
            </Button>
            <Button onClick={this.deleteContact} color="primary" autoFocus>
              确认
            </Button>
          </DialogActions>
        </Dialog>
        <Button variant="fab" className={classes.fab}>
          <AddIcon />
        </Button>
      </>
    )
  }

  componentDidMount () {
    this.props.connectionService && this.props.connectionService.getConnections()
  }
}

export default connectionServlet(withStyles(styles)(Contacts))
