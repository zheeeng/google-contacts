import React from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import AutoRenewIcon from '@material-ui/icons/Autorenew'

import { groupServlet, GroupServletProps, Contact } from '~src/Context/GAPI'

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
})

type Props = GroupServletProps & WithStyles<typeof styles> & {
  id?: string,
}

type State = {
}

class LabelPage extends React.PureComponent<Props, State> {

  render () {
    return (
      <div>hello</div>
    )
  }

  componentDidMount () {
    if (!this.props.id) return

    this.props.groupService.fetchLabelMembers(this.props.id)
  }

  componentDidUpdate (prevProp: Props) {
    if (!this.props.id) return

    if (this.props.id !== prevProp.id) {
      this.props.groupService.fetchLabelMembers(this.props.id)
    }
  }
}

export default groupServlet(withStyles(styles)(LabelPage))
