import React from 'react'

import { toastCapture } from '~src/utils/toast'
import clientConfig from '~src/config/client.json'
import { DomainPresets } from './locale.interface'

type Store = {
  authService?: AuthService,
  peopleService?: AuthService,
  contactGroupService?: AuthService,
  contactGroupMemberService?: AuthService,
}

interface AuthService {
  user?: gapi.auth2.GoogleUser,
  signIn: Function,
  signOut: Function,
  isSignedIn: boolean,
  isSigningIn: boolean,
  isSigningOut: boolean,
}

interface ServletHubProps {
  local: DomainPresets,
}

interface State {
  user?: gapi.auth2.GoogleUser,
  isSigningIn: boolean,
  isSigningOut: boolean,
}

const { Provider, Consumer } = React.createContext<Store>({})

export {
  Consumer,
}

export function servletHub<P> (Component: React.ComponentType<P>) {
  const displayName = `ServletHubComponent(${Component.displayName || Component.name || 'Component'})`

  return class ServletHubComponent extends React.PureComponent<P & ServletHubProps, State> {
    static displayName = displayName

    private _authInstance?: gapi.auth2.GoogleAuth

    /**
     * Getter authInstance
     * @return {gapi.auth2.GoogleAuth}
     */
    get authInstance (): gapi.auth2.GoogleAuth | undefined {
      return this._authInstance
    }

    /**
     * Setter authInstance
     * @param {gapi.auth2.GoogleAuth} value
     */
    set authInstance (value: gapi.auth2.GoogleAuth | undefined) {
      this._authInstance = value
    }

    state = {
      user: undefined,
      isSigningIn: false,
      isSigningOut: false,
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

    render () {
      const authService = this.authService
      return (
        <Provider value={{ authService }}>
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

      this.authInstance.isSignedIn.listen(this.updateSignInStatus)

      this.updateSignInStatus(this.authInstance.isSignedIn.get())
    }

    updateSignInStatus = (isSignedIn: boolean) => {
      this.setState(state => ({
        ...state,
        isSignedIn, isSigningIn: false, isSigningOut: false,
      }))
    }

    signIn = async () => {
      const message = this.props.local.message

      if (!this.authInstance) return toastCapture(message.AUTH_UNINITIALIZED)
      if (!this.state.isSigningIn) return toastCapture(message.AUTH_IS_SIGNING_IN)
      if (!this.state.isSigningOut) return toastCapture(message.AUTH_IS_SIGNING_OUT)

      this.setState(state => ({ ...state, isSigningIn: true }))

      try {
        const user = await this.authInstance.signIn()
        this.setState(state => ({ ...state, user }))
      } catch (e) {
        return toastCapture(e)
      } finally {
        this.setState(state => ({ ...state, isSigningIn: false }))
      }
    }

    singOut = async () => {
      const message = this.props.local.message

      if (!this.authInstance) return toastCapture(message.AUTH_UNINITIALIZED)
      if (!this.state.isSigningIn) return toastCapture(message.AUTH_IS_SIGNING_IN)
      if (!this.state.isSigningOut) return toastCapture(message.AUTH_IS_SIGNING_OUT)
      this.setState(state => ({ ...state, isSigningOut: true }))

      try {
        await this.authInstance.signOut()
        this.setState(state => ({ ...state, user: undefined }))
      } catch (e) {
        return toastCapture(e)
      } finally {
        this.setState(state => ({ ...state, isSigningOut: false }))
      }
    }
  }
}

export type AuthServletProps = Pick<Store, 'authService'>

export function authServlet <P> (
  Component: React.ComponentType<P & AuthServletProps>,
) {
  const displayName = `ServletComponent(${Component.displayName || Component.name || 'Component'})`

  return class ServletComponent extends React.PureComponent<P> {
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
