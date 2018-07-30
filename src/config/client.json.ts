type InitOption =  FirstParam<typeof gapi.client.init>

const config: InitOption =  {
  apiKey: process.env.REACT_APP_GOOGLE_APP_KEY,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'],
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  scope: 'https://www.googleapis.com/auth/contacts',
}

export default config
