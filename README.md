# Google Contacts

[![Greenkeeper badge](https://badges.greenkeeper.io/zheeeng/Google-contacts.svg)](https://greenkeeper.io/)

Google Contacts Demo

# Demo Site

https://contacts.zheeeng.me

## Setup

### prerequisite

Make sure you have got the Google APP Key and a Client ID, you may get them through the following link:

https://console.developers.google.com/start/api?id=people.googleapis.com&credential=client_key

### Cli

Take the `yarn` as the example:

git clone this repo and then install dependencies:

```sh
> git clone https://github.com/zheeeng/Google-contacts.git
> cd Google-contacts
> yarn
```

Provide these keys as environment variables:

```shell
> REACT_APP_GOOGLE_APP_KEY=<YOUR_GOOGLE_APP_KEY> REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID> yarn start
```

## Build

```shell
> REACT_APP_GOOGLE_APP_KEY=<YOUR_GOOGLE_APP_KEY> REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID> yarn build
```

## Note

1. App requires you login with Google Account and Chrome will warns you insecure accessing, just bypass it and authorize your consent.
2. git ignores `/public/CNAME` file, it means you could add your own `/public/CNAME` file for hosting your site using github pages.
