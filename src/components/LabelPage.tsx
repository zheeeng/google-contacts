import React from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import AutoRenewIcon from '@material-ui/icons/Autorenew'

import { groupServlet, GroupServletProps, Label } from '~src/Context/GAPI'

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

type Props = GroupServletProps & WithStyles<typeof styles>

class LabelPage extends React.PureComponent<Props> {
  render () {
    return (
      <div>hello</div>
    )
  }

  componentDidMount () {
    // this.props.groupService.fetchLabels()
  }
}

export default groupServlet(withStyles(styles)(LabelPage))
