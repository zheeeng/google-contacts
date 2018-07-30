import React from 'react'
import { connectionServlet, ConnectionServletProps, Contact } from '~src/Context/GAPI'
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
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import CloseIcon from '@material-ui/icons/Close'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Zoom from '@material-ui/core/Zoom'

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
  card: {
    display: 'flex',
  },
  details: {
    minWidth: 360,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  dialogControls: {
    display: 'flex',
    alignItems: 'center',
  },
  deleteContactButton: {
    margin: theme.spacing.unit,
  },
  deleteContactIcon: {
    marginLeft: theme.spacing.unit,
  },
  closeIcon: {
    height: 24,
    width: 24,
  },
})

type Props = ConnectionServletProps & WithStyles<typeof styles>

interface State {
  toDisplayResourceName: string,
  toDeleteResourceName: string,
  createFormDialogOpen: boolean,
}

class Contacts extends React.PureComponent<Props, State> {
  state = {
    toDisplayResourceName: '',
    toDeleteResourceName: '',
    createFormDialogOpen: false,
  }

  private get displayedContact () {
    return this.props.connectionService.connections
      .find(connection => connection.resourceName === this.state.toDisplayResourceName)
  }

  // nextOrPrev: undefined set current, true set next, false set prev
  private toDisplayContact = (resourceName: string, nextOrPrev?: boolean) => () => {
    if (nextOrPrev === undefined) {
      this.setState(
        state => ({ ...state, toDisplayResourceName: resourceName }),
      )
    } else {
      const connections = this.props.connectionService.connections
      const currentIndex = connections.findIndex(
        contact => contact.resourceName === resourceName,
      )

      if ((nextOrPrev === true) && (currentIndex < connections.length - 1)) {
        const nextResource = connections[currentIndex + 1].resourceName
        this.setState(
          state => ({ ...state, toDisplayResourceName: nextResource }),
        )
      } else if ((nextOrPrev === false) && (currentIndex > 0)) {
        const prevResource = connections[currentIndex - 1].resourceName
        this.setState(
          state => ({ ...state, toDisplayResourceName: prevResource }),
        )
      }
    }
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
      this.setState(state => ({
        ...state,
        toDeleteResourceName: '',
        toDisplayResourceName: '',
      }))

      this.props.connectionService.deleteContact(toDeleteResourceName)
    }
  }

  private closeDisplayDialog = ()  => {
    this.setState(state => ({ ...state, toDisplayResourceName: '' }))
  }

  private openCreateFormDialog = () => {
    this.setState(state => ({ ...state, createFormDialogOpen: true }))
  }
  private closeCreateFormDialog = () => {
    this.setState(state => ({ ...state, createFormDialogOpen: false }))
  }
  private submitCreateForm = () => {
    this.setState(state => ({ ...state, createFormDialogOpen: false }))
  }

  private renderContact = (contact: Contact) =>
    (
      <ListItem
        key={contact.resourceName}
        dense
        button
        onClick={this.toDisplayContact(contact.resourceName)}
        classes={{
          container: this.props.classes.listItem,
        }}
      >
        <Avatar alt={contact.name} src={contact.avatar} />
        <ListItemText primary={contact.name} />
        <ListItemText primary={contact.email} />
        <ListItemSecondaryAction>
          <IconButton>
            <StarIcon />
          </IconButton>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton onClick={this.toDeleteContact(contact.resourceName)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )

  render () {
    const classes = this.props.classes

    if (this.props.connectionService.isGettingConnections) {
      return (
        <div className={classes.root}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      )
    }

    if (this.props.connectionService.connectionApiHasError) {
      return (
        <div className={classes.root}>
          <Typography variant="headline">
            Some errors happens! Try refresh this page.
          </Typography>
        </div>
      )
    }

    const connections = this.props.connectionService.connections
    const displayedContact = this.displayedContact || {} as Contact

    return (
      <>
        <List className={classes.root}>
          {connections.map(this.renderContact)}
        </List>
        <>
          <Button variant="fab" className={classes.fab} onClick={this.openCreateFormDialog}>
            <AddIcon />
          </Button>
        </>
        <>
          <Dialog
            open={!!displayedContact.resourceName}
            onClose={this.closeDisplayDialog}
            TransitionComponent={Zoom}
          >
            <Card className={classes.card}>
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography variant="headline">
                    {displayedContact.name}
                  </Typography>
                  <Typography variant="subheading" color="textSecondary">
                    {displayedContact.email}
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <div className={classes.dialogControls}>
                    <IconButton>
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton>
                      <NavigateNextIcon />
                    </IconButton>
                    <IconButton onClick={this.closeDisplayDialog}>
                      <CloseIcon className={classes.closeIcon} />
                    </IconButton>
                  </div>
                  <Button
                    variant="contained" color="secondary"
                    className={classes.deleteContactButton}
                    onClick={this.toDeleteContact(this.state.toDisplayResourceName)}
                  >
                    删除
                    <DeleteIcon className={classes.deleteContactIcon} />
                  </Button>
                </div>
              </div>
              <CardMedia
                className={classes.cover}
                image={displayedContact.avatar}
                title={displayedContact.name}
              />
            </Card>
          </Dialog>
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
          <Dialog
            open={this.state.createFormDialogOpen}
            onClose={this.closeCreateFormDialog}
            TransitionComponent={Zoom}
          >
            <DialogTitle>创建联系人</DialogTitle>
            <DialogContent>
            {/*   <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
              /> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeCreateFormDialog} color="primary">
                取消
              </Button>
              <Button onClick={this.submitCreateForm} color="primary">
                提交
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </>
    )
  }

  componentDidMount () {
    this.props.connectionService.fetchConnections()
  }
}

export default connectionServlet(withStyles(styles)(Contacts))
