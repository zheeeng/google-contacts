import React from 'react'

import { toastCapture } from '~src/utils/toast'
import clientConfig from '~src/config/client.json'
import { DomainPresets } from './locale.interface'

export type User = gapi.auth2.GoogleUser
export type Person = gapi.client.people.Person

type Store = {
  authService: AuthService,
  connectionService: ConnectionService,
  // groupService: GroupService,
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
interface ConnectionService {
  isGettingConnections: boolean,
  connectionApiHasError: boolean,
  connections: Contact[],
  fetchConnections: () => Promise<Person[]>,
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
interface GroupService {}

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
    }

    private _tasks: QueuedTask[] = []
    private _authInstance?: gapi.auth2.GoogleAuth
    private _peopleAPI?: gapi.client.people.PeopleResource
    private _connectionAPI?: gapi.client.people.ConnectionsResource

    /**
     * Getter authInstance
     * @return {gapi.auth2.GoogleAuth}
     */
    get authInstance (): gapi.auth2.GoogleAuth | undefined {
      return this._authInstance
    }

    /**
     * Setter peopleAPI
     * @param {gapi.client.people.PeopleResource} value
     */
    set peopleAPI (value: gapi.client.people.PeopleResource | undefined) {
      this._peopleAPI = value
    }

    /**
     * Getter peopleAPI
     * @return {gapi.client.people.PeopleResource}
     */
    get peopleAPI (): gapi.client.people.PeopleResource | undefined {
      return this._peopleAPI
    }

    /**
     * Setter connectionAPI
     * @param {gapi.client.people.ConnectionsResource} value
     */
    set connectionAPI (value: gapi.client.people.ConnectionsResource | undefined) {
      this._connectionAPI = value
    }

    /**
     * Getter connectionAPI
     * @return {gapi.client.people.ConnectionsResource}
     */
    get connectionAPI (): gapi.client.people.ConnectionsResource | undefined {
      return this._connectionAPI
    }

    /**
     * Setter authInstance
     * @param {gapi.auth2.GoogleAuth} value
     */
    set authInstance (value: gapi.auth2.GoogleAuth | undefined) {
      this._authInstance = value
    }

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
        fetchConnections: this.fetchConnections,
        createContact: this.createContact,
        deleteContact: this.deleteContact,
      }
    }

    render () {
      const authService = this.authService
      const connectionService = this.connectionService
      return (
        <Provider value={{ authService, connectionService }}>
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

      try {
        await this.peopleAPI.deleteContact({
          resourceName,
        })

        this.setState(state => ({
          ...state,
          connections: state.connections.filter(connection => connection.resourceName !== resourceName),
        }))
      } catch (error) {
        toastCapture(error)
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
