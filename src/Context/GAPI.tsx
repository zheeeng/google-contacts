import React from 'react'

import { toastCapture } from '~src/utils/toast'
import clientConfig from '~src/config/client.json'
import { DomainPresets } from './locale.interface'

export type User = gapi.auth2.GoogleUser
export type Person = gapi.client.people.Person
export type Group = gapi.client.people.ContactGroup

type Store = {
  authService: AuthService,
  connectionService: ConnectionService,
  groupService: LabelService,
}

interface AuthService {
  user?: User,
  signIn: () => Promise<void>,
  signOut: () => Promise<void>,
  isSignedIn: boolean,
  isSigningIn: boolean,
  isSigningOut: boolean,
}

export type Contact = {
  name: string,
  email: string,
  avatar: string,
  resourceName: string,
}

export type Label = {
  resourceName: string,
  name: string,
}
interface ConnectionService {
  isGettingConnections: boolean,
  connectionApiHasError: boolean,
  connections: Contact[],
  fetchContacts: () => Promise<Person[]>,
  createContact: (contact: Partial<Contact>) => Promise<any>,
  deleteContact: (resourceName: string) => Promise<any>,
}

const convertPersonToContact = (person: Person): Contact =>
  ({
    name: person.names && person.names[0] && person.names[0].displayName || '',
    email: person.emailAddresses && person.emailAddresses[0] && person.emailAddresses[0].value || '',
    avatar: person.photos && person.photos[0] && person.photos[0].url || '',
    resourceName: person.resourceName!,
  })

const convertGroupToLabel = (group: Group): Label =>
  ({
    name: group.name || '',
    resourceName: group.resourceName!,
  })

interface LabelService {
  labels: Label[],
  createLabel: (label: string) => Promise<any>,
  fetchLabels: () => Promise<any>,
  groupMemberAPI?: gapi.client.people.MembersResource
}

interface ServletHubProps {
  local: DomainPresets,
}

interface State {
  user?: User,
  isSigningIn: boolean,
  isSigningOut: boolean,
  connections: Person[],
  isGettingConnections: boolean,
  connectionApiHasError: boolean,
  isDeletingContact: boolean,
  isCreatingContact: boolean,
  groups: Group[],
  isGettingGroups: boolean,
  isDeletingGroup: boolean,
  isCreatingGroup: boolean,
  groupApiHasError: boolean,
}

type QueuedTask = { fn: (...args: any[]) => Promise<any>, args: any[] }

const { Provider, Consumer } = React.createContext<Store>({} as Store)

export {
  Consumer,
}

export function servletHub<P> (Component: React.ComponentType<P>) {
  const displayName = `ServletHubComponent(${Component.displayName || Component.name || 'Component'})`

  return class ServletHubComponent extends React.PureComponent<P & ServletHubProps, State> {
    static displayName = displayName

    // TODO: refactor them
    state: State = {
      // auth
      user: undefined,
      isSigningIn: false,
      isSigningOut: false,
      // connection
      connections: [],
      isGettingConnections: false,
      connectionApiHasError: false,
      // delete
      isDeletingContact: false,
      isCreatingContact: false,
      // group
      groups: [],
      isGettingGroups: false,
      isDeletingGroup: false,
      isCreatingGroup: false,
      groupApiHasError: false,
    }

    private _tasks: QueuedTask[] = []
    private authInstance?: gapi.auth2.GoogleAuth
    private peopleAPI?: gapi.client.people.PeopleResource
    private connectionAPI?: gapi.client.people.ConnectionsResource
    private groupAPI?: gapi.client.people.ContactGroupsResource
    private groupMemberAPI?: gapi.client.people.MembersResource

    private get isSignedIn (): boolean {
      return !!this.authInstance && this.authInstance.isSignedIn.get()
    }

    private get authService (): AuthService {
      return {
        user: this.state.user,
        signIn: this.signIn,
        signOut: this.singOut,
        isSignedIn: this.isSignedIn,
        isSigningIn: this.state.isSigningIn,
        isSigningOut: this.state.isSigningOut,
      }
    }

    private get connectionService (): ConnectionService {
      return {
        isGettingConnections: this.state.isGettingConnections,
        connectionApiHasError: this.state.connectionApiHasError,
        connections: this.state.connections.map(convertPersonToContact),
        fetchContacts: this.fetchConnections,
        createContact: this.createContact,
        deleteContact: this.deleteContact,
      }
    }

    private get groupService (): LabelService {
      return {
        labels: this.state.groups.map(convertGroupToLabel),
        createLabel: this.createGroup,
        fetchLabels: this.fetchGroups,
        groupMemberAPI: this.groupMemberAPI,
      }
    }

    render () {
      const authService = this.authService
      const connectionService = this.connectionService
      const groupService = this.groupService
      return (
        <Provider value={{ authService, connectionService, groupService }}>
          <Component {...this.props} />
        </Provider>
      )
    }

    componentDidMount () {
      gapi.load('client:auth2', this.initClient)
    }

    initClient = async () => {
      await gapi.client.init(clientConfig)

      this.authInstance = gapi.auth2.getAuthInstance()
      this.connectionAPI = (gapi.client.people as any).people.connections
      this.peopleAPI = (gapi.client.people as any).people
      this.groupAPI = (gapi.client.people as any).contactGroups
      this.groupMemberAPI = (gapi.client.people as any).contactGroups.members

      this.authInstance.isSignedIn.listen(this.updateSignInStatus)

      this.updateSignInStatus(this.authInstance.isSignedIn.get())
    }

    private updateSignInStatus = (isSignedIn: boolean) => {

      this.setState(
        state => ({
          ...state,
          isSignedIn, isSigningIn: false, isSigningOut: false,
        }),
        () => {
          const chain = this._tasks.reduce(
            (pChain, task) =>
              pChain.then(() => {
                this._tasks = this._tasks.filter(t => t !== task)
                task.fn(...task.args)
              }),
            Promise.resolve(),
          )
        },
      )
    }

    private signIn = async () => {
      const message = this.props.local.message

      if (!this.authInstance) throw toastCapture(message.AUTH_UNINITIALIZED)
      if (this.state.isSigningIn) throw toastCapture(message.AUTH_IS_SIGNING_IN)
      if (this.state.isSigningOut) throw toastCapture(message.AUTH_IS_SIGNING_OUT)

      this.setState(state => ({ ...state, isSigningIn: true }))

      try {
        const user = await this.authInstance.signIn()
        this.setState(state => ({ ...state, user }))
      } catch (e) {
        throw toastCapture(e)
      } finally {
        this.setState(state => ({ ...state, isSigningIn: false }))
      }
    }

    private singOut = async () => {
      const message = this.props.local.message

      if (!this.authInstance) throw toastCapture(message.AUTH_UNINITIALIZED)
      if (this.state.isSigningIn) throw toastCapture(message.AUTH_IS_SIGNING_IN)
      if (this.state.isSigningOut) throw toastCapture(message.AUTH_IS_SIGNING_OUT)
      this.setState(state => ({ ...state, isSigningOut: true }))

      try {
        await this.authInstance.signOut()
        this.setState(state => ({ ...state, user: undefined }))
      } catch (e) {
        throw toastCapture(e)
      } finally {
        this.setState(state => ({ ...state, isSigningOut: false }))
      }
    }

    private fetchConnections = async (...args: any[]) => {
      const message = this.props.local.message

      if (!this.connectionAPI) {
        this._tasks.push({
          fn: this.fetchConnections,
          args,
        })

        throw toastCapture(message.AUTH_UNINITIALIZED)
      }

      this.setState(state => ({
        ...state,
        isGettingConnections: true,
        connectionApiHasError: false,
      }))

      try {
        const response = await this.connectionAPI.list({
          resourceName: 'people/me',
          pageSize: 100,
          personFields: 'names,emailAddresses,phoneNumbers,nicknames,photos',
        })

        const connections = response.result.connections || []
        this.setState(state => ({
          ...state,
          connectionApiHasError: false,
          isGettingConnections: false,
          connections,
        }))

        return connections
      } catch (error) {
        this.setState(state => ({
          ...state,
          connectionApiHasError: true,
          isGettingConnections: false,
        }))
        throw toastCapture(error)
      }
    }

    private createGroup = async (groupName: string, ...args: any[]) => {
      const message = this.props.local.message

      if (!this.groupAPI) {
        this._tasks.push({
          fn: this.createGroup,
          args: [groupName].concat(args),
        })

        throw toastCapture(message.AUTH_UNINITIALIZED)
      }

      this.setState(state => ({
        ...state,
        groupApiHasError: false,
        isCreatingGroup: false,
      }))

      try {
        const response = await this.groupAPI.create({
          contactGroup: {
            name: groupName,
          },
        } as any)

        const group = response.result || []
        this.setState(state => ({
          ...state,
          groupApiHasError: false,
          isCreatingGroup: false,
          groups: state.groups.concat(group),
        }))
      } catch (error) {
        this.setState(state => ({
          ...state,
          isCreatingGroup: false,
          groupApiHasError: true,
        }))
        throw toastCapture(error)
      }
    }

    private fetchGroups = async (...args: any[]) => {
      const message = this.props.local.message

      if (!this.groupAPI) {
        this._tasks.push({
          fn: this.fetchGroups,
          args,
        })

        throw toastCapture(message.AUTH_UNINITIALIZED)
      }

      this.setState(state => ({
        ...state,
        isGettingGroups: true,
        groupApiHasError: false,
      }))

      try {
        const response = await this.groupAPI.list({})

        const groups = response.result.contactGroups || []
        this.setState(state => ({
          ...state,
          groupApiHasError: false,
          isGettingGroups: false,
          groups,
        }))
      } catch (error) {
        this.setState(state => ({
          ...state,
          groupApiHasError: true,
          isGettingGroups: false,
        }))
        throw toastCapture(error)
      }
    }

    private createContact = async (contact: Partial<Contact>, ...args: any[]) => {
      const message = this.props.local.message

      if (!this.peopleAPI) {
        this._tasks.push({
          fn: this.createContact,
          args: [contact].concat(args),
        })

        throw toastCapture(message.AUTH_UNINITIALIZED)
      }

      this.setState(state => ({
        ...state,
        connectionApiHasError: false,
        isCreatingContact: false,
      }))

      try {
        const response = await this.peopleAPI.createContact({
          parent: 'people/me',
          emailAddresses: [{ value: contact.email || '' }],
          names: [{ displayName: contact.name || '' }],
        } as any)

        const connection = response.result || []
        this.setState(state => ({
          ...state,
          connectionApiHasError: false,
          isCreatingContact: false,
          connections: state.connections.concat(connection),
        }))
      } catch (error) {
        this.setState(state => ({
          ...state,
          isCreatingContact: false,
          connectionApiHasError: true,
        }))
        throw toastCapture(error)
      }
    }

    private deleteContact = async (resourceName: string, ...args: any[]) => {
      const message = this.props.local.message

      if (!this.peopleAPI) {
        this._tasks.push({
          fn: this.deleteContact,
          args: [resourceName].concat(args),
        })

        throw toastCapture(message.AUTH_UNINITIALIZED)
      }

      this.setState(state => ({
        ...state,
        connectionApiHasError: false,
        isDeletingContact: true,
      }))

      try {
        await this.peopleAPI.deleteContact({
          resourceName,
        })

        this.setState(state => ({
          ...state,
          connections: state.connections.filter(connection => connection.resourceName !== resourceName),
          connectionApiHasError: false,
          isDeletingContact: false,
        }))
      } catch (error) {
        this.setState(state => ({
          ...state,
          connectionApiHasError: true,
          isDeletingContact: false,
        }))
        throw toastCapture(error)
      }
    }
  }
}

export type AuthServletProps = Pick<Store, 'authService'>

export function authServlet <P extends AuthServletProps> (
  Component: React.ComponentType<P>,
) {
  const displayName = `AuthServletComponent(${Component.displayName || Component.name || 'Component'})`

  return class ServletComponent extends React.PureComponent<Omit<P, keyof AuthServletProps>> {
    static displayName = displayName

    render () {
      return (
        <Consumer>
          {({ authService }) => (
            <Component {...this.props} authService={authService} />
          )}
        </Consumer>
      )
    }
  }

}

export type ConnectionServletProps = Pick<Store, 'connectionService'>

export function connectionServlet <P extends ConnectionServletProps> (
  Component: React.ComponentType<P>,
) {
  const displayName = `ConnectionServletComponent(${Component.displayName || Component.name || 'Component'})`

  return class ServletComponent extends React.PureComponent<Omit<P, keyof ConnectionServletProps>> {
    static displayName = displayName

    render () {
      return (
        <Consumer>
          {({ connectionService }) => (
            <Component {...this.props} connectionService={connectionService} />
          )}
        </Consumer>
      )
    }
  }

}

export type GroupServletProps = Pick<Store, 'groupService'>

export function groupServlet <P extends GroupServletProps> (
  Component: React.ComponentType<P>,
) {
  const displayName = `GroupServletComponent(${Component.displayName || Component.name || 'Component'})`

  return class ServletComponent extends React.PureComponent<Omit<P, keyof GroupServletProps>> {
    static displayName = displayName

    render () {
      return (
        <Consumer>
          {({ groupService }) => (
            <Component {...this.props} groupService={groupService} />
          )}
        </Consumer>
      )
    }
  }

}
