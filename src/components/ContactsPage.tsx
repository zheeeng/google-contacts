import React from 'react'
import { connectionServlet, ConnectionServletProps } from '~src/context/GAPI'

import ContactList from './ContactList'

type Props = ConnectionServletProps

interface State {
}

class ContactsPage extends React.PureComponent<Props, State> {

  render () {
    return (
      <ContactList
        contacts={this.props.connectionService.contacts}
        createContact={this.props.connectionService.createContact}
        isGettingConnections={this.props.connectionService.isGettingConnections}
        deleteContact={this.props.connectionService.deleteContact}
        hasError={this.props.connectionService.connectionApiHasError}
      />
    )
  }

  componentDidMount () {
    this.props.connectionService.fetchContacts()
  }
}

export default connectionServlet(ContactsPage)
