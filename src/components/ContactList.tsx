import React from 'react'
import { Contact } from '~src/context/GAPI'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import List from '@material-ui/core/List'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import EmailIcon from '@material-ui/icons/Email'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import CloseIcon from '@material-ui/icons/Close'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Zoom from '@material-ui/core/Zoom'

import ContactItem from './ContactItem'
import { AppSearchValueConsumer } from '~src/context/AppSearchValue'

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

type Props = WithStyles<typeof styles> & {
  contacts: Contact[],
  createContact: (c: {
    name: string,
    email: string,
  }) => void,
  isGettingConnections: boolean,
  hasError: boolean,
  deleteContact: (r: string) => void,
}

interface State {
  toDisplayResourceName: string,
  toDeleteResourceName: string,
  createFormDialogOpen: boolean,
  notificationMessage: string,
  newContactName: string,
  newContactEmail: string,
}

class ContactList extends React.PureComponent<Props, State> {
  state = {
    toDisplayResourceName: '',
    toDeleteResourceName: '',
    createFormDialogOpen: false,
    notificationMessage: '',
    newContactName: '',
    newContactEmail: '',
  }

  private get displayedContact () {
    return this.props.contacts
      .find(contact => contact.resourceName === this.state.toDisplayResourceName)
  }

  // nextOrPrev: undefined set current, true set next, false set prev
  private toDisplayContact = (resourceName: string, nextOrPrev?: boolean) => () => {
    if (nextOrPrev === undefined) {
      this.setState(
        state => ({ ...state, toDisplayResourceName: resourceName }),
      )
    } else {
      const contacts = this.props.contacts
      const currentIndex = contacts.findIndex(
        contact => contact.resourceName === resourceName,
      )

      if (nextOrPrev && (currentIndex < contacts.length - 1)) {
        const nextResource = contacts[currentIndex + 1].resourceName
        this.setState(
          state => ({ ...state, toDisplayResourceName: nextResource }),
        )
      } else if (!nextOrPrev && (currentIndex > 0)) {
        const prevResource = contacts[currentIndex - 1].resourceName
        this.setState(
          state => ({ ...state, toDisplayResourceName: prevResource }),
        )
      }
    }
  }

  private notification = (message: string) => {
    this.setState(state => ({ ...state, notificationMessage: message }))
  }

  private clearNotification = () => {
    this.setState(state => ({ ...state, notificationMessage: '' }))
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

      this.props.deleteContact(toDeleteResourceName)
    }
  }

  private closeDisplayDialog = ()  => {
    this.setState(state => ({ ...state, toDisplayResourceName: '' }))
  }

  private openCreateFormDialog = () => {
    this.setState(state => ({
      ...state,
      createFormDialogOpen: true,
      newContactName: '',
      newContactEmail: '',
    }))
  }

  private closeCreateFormDialog = () => {
    this.setState(state => ({
      ...state,
      createFormDialogOpen: false,
      newContactName: '',
      newContactEmail: '',
    }))
  }

  private submitCreateForm = () => {
    const { newContactName, newContactEmail } = this.state
    if (!newContactName) {
      this.notification('用户名不能为空')
      return
    }

    if (!newContactEmail) {
      this.notification('邮箱不能为空')

      return
    }

    this.setState(state => ({
      ...state,
      createFormDialogOpen: false,
      newContactName: '',
      newContactEmail: '',
    }))

    this.props.createContact({
      name: newContactName,
      email: newContactEmail,
    })
  }

  private createNewContactFieldChangeHandler =
    (field: 'email' | 'name') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      switch (field) {
        case 'name': {
          this.setState(state => ({ ...state, newContactName: value }))
          return
        }
        case 'email': {
          this.setState(state => ({ ...state, newContactEmail: value }))
          return
        }
        default: {
          return
        }
      }
  }

  render () {
    const classes = this.props.classes

    if (this.props.isGettingConnections) {
      return (
        <div className={classes.root}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      )
    }

    if (this.props.hasError) {
      return (
        <div className={classes.root}>
          <Typography variant="headline">
            Some errors happens! Try refresh this page.
          </Typography>
        </div>
      )
    }

    const contacts = this.props.contacts
    const displayedContact = this.displayedContact || {} as Contact
    const toDisplayResourceName = this.state.toDisplayResourceName

    return (
      <>
        <List className={classes.root}>
          <AppSearchValueConsumer>
          {({ searchValue }) => contacts
            .filter(contact => !!searchValue
              ? (contact.name && contact.name.includes(searchValue))
                 || (contact.email && contact.email.includes(searchValue))
              : true,
            )
            .map(contact => (
              <ContactItem
                key={contact.resourceName}
                contact={contact}
                onClick={this.toDisplayContact(contact.resourceName)}
                onDelete={this.toDeleteContact(contact.resourceName)}
              />
            ))
          }
          </AppSearchValueConsumer>
        </List>
        <>
          <Button variant="fab" className={classes.fab} onClick={this.openCreateFormDialog}>
            <AddIcon />
          </Button>
        </>
        <>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={!!this.state.notificationMessage}
            autoHideDuration={4000}
            onClose={this.clearNotification}
            message={<span>{this.state.notificationMessage}</span>}
          />
        </>
        <>
          <Dialog
            open={!!displayedContact.resourceName}
            onClose={this.closeDisplayDialog}
            TransitionComponent={Zoom}
          >
            {!!displayedContact.resourceName && (
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
                      <IconButton onClick={this.toDisplayContact(toDisplayResourceName, false)}>
                        <NavigateBeforeIcon />
                      </IconButton>
                      <IconButton onClick={this.toDisplayContact(toDisplayResourceName, true)}>
                        <NavigateNextIcon />
                      </IconButton>
                      <IconButton onClick={this.closeDisplayDialog}>
                        <CloseIcon className={classes.closeIcon} />
                      </IconButton>
                    </div>
                    <Button
                      variant="contained" color="secondary"
                      className={classes.deleteContactButton}
                      onClick={this.toDeleteContact(toDisplayResourceName)}
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
            )}
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
              <TextField
                autoFocus
                margin="dense"
                label="Nickname"
                type="text"
                value={this.state.newContactName}
                onChange={this.createNewContactFieldChangeHandler('name')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Email"
                type="email"
                value={this.state.newContactEmail}
                onChange={this.createNewContactFieldChangeHandler('email')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
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
}

export default withStyles(styles)(ContactList)
