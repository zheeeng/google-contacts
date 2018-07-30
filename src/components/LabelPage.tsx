import React from 'react'
import { connectionServlet, groupServlet, GroupServletProps, ConnectionServletProps } from '~src/context/GAPI'
import ContactList from './ContactList'

type Props = GroupServletProps & ConnectionServletProps & {
  id?: string,
}

type State = {
  lastContactsLength: number,
}

class LabelPage extends React.PureComponent<Props, State> {

  state = {
    lastContactsLength: 0,
  }

  render () {
    const contacts = this.props.id && this.props.groupService.getLabelMembers(this.props.id) || []

    return (
      <ContactList
        contacts={contacts}
        createContact={this.props.connectionService.createContact}
        isGettingConnections={this.props.connectionService.isGettingConnections}
        deleteContact={this.props.connectionService.deleteContact}
        hasError={this.props.connectionService.connectionApiHasError}
      />
    )
  }

  componentDidMount () {
    if (!this.props.id) return

    this.props.groupService.fetchLabelMembers(this.props.id)
  }

  componentDidUpdate (prevProp: Props, prevState: State) {
    if (!this.props.id) return

    if ((this.props.id !== prevProp.id)
      || (this.props.connectionService.contacts.length !== prevState.lastContactsLength)) {
        this.setState(
          state => ({
            ...state,
            lastContactsLength: this.props.connectionService.contacts.length,
          }),
          () => {
            this.props.id && this.props.groupService.fetchLabelMembers(this.props.id)
          },
        )
      }
  }
}

export default connectionServlet(groupServlet(LabelPage))
