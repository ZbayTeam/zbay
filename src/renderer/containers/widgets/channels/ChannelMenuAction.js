import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom'

import ChannelMenuAction from '../../../components/widgets/channels/ChannelMenuAction'
import { actionCreators } from '../../../store/handlers/modals'
import importedChannelHandler from '../../../store/handlers/importedChannel'
import dmChannelSelectors from '../../../store/selectors/directMessageChannel'

export const mapStateToProps = state => ({
  targetAddress: dmChannelSelectors.targetRecipientAddress(state)
})

export const mapDispatchToProps = (dispatch, { history }) => {
  return bindActionCreators(
    {
      onInfo: actionCreators.openModal('channelInfo'),
      onMute: () => console.warn('[ChannelMenuAction] onMute not implemented'),
      onDelete: () => importedChannelHandler.epics.removeChannel(history)
    },
    dispatch
  )
}

export default R.compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ChannelMenuAction)
