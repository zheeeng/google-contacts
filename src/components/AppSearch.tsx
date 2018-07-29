import React from 'react'
import classNames from 'classnames'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => createStyles({
  root: {
    marginRight: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 3,
  },
  search: {
    'transition': theme.transitions.create(['width', 'max-width', 'background']),
    'width': '100%',
    'maxWidth': 540,
    'borderRadius': 2,
    'display': 'flex',
    'alignItems': 'center',
    'background': fade(theme.palette.common.white, 0.15),
    '&:hover': {
      background: fade(theme.palette.common.white, 0.25),
    },
  },
  searchFocused: {
    '&&': {
      maxWidth: 720,
      background: theme.palette.common.white,
      color: theme.palette.common.black,
    },
  },
  searchIcon: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  inputRoot: {
    width: '100%',
    color: 'inherit',
  },
  inputInput: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
})

interface Props extends WithStyles<typeof styles> {
  className?: string
}

interface State {
  focused: boolean,
}

class AppSearch extends React.PureComponent<Props, State> {
  state = {
    focused: false,
  }

  private onFocus = () => {
    this.setState(state => ({ ...state, focused: true }))
  }

  private onBlur = () => {
    this.setState(state => ({ ...state, focused: false }))
  }

  render () {
    const { classes, className } = this.props

    return (
      <div className={classNames(classes.root, className)}>
        <div className={classNames(classes.search, this.state.focused && classes.searchFocused)}>
          <SearchIcon className={classes.searchIcon}/>
          <Input
            disableUnderline
            placeholder="Search…"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
      </div >
    )
  }
}

export default withStyles(styles)(AppSearch)
