import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { Formik } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import { AutoSizer } from 'react-virtualized'
import { Scrollbars } from 'react-custom-scrollbars'
import * as Yup from 'yup'
import BigNumber from 'bignumber.js'

import { MESSAGE_SIZE } from '../../../zbay/transit'
// import { createTransfer } from '../../../zbay/messages'
import { networkFee } from '../../../../shared/static'
import SendMessageInitial from './SendMessageSeparateInitial'

import Modal from '../Modal'

const styles = theme => ({})

export const formSchema = users => {
  return Yup.object().shape(
    {
      recipient: Yup.mixed()
        .test(
          'match',
          'Wrong address format or username does not exist',
          function (string) {
            const isAddressValid = /^t1[a-zA-Z0-9]{33}$|^ztestsapling1[a-z0-9]{75}$|^zs1[a-z0-9]{75}$|[A-Za-z0-9]{35}/.test(
              string
            )
            const includesNickname = users
              .toList()
              .filter(obj => obj.get('nickname') === string)
              .first()
            return includesNickname || isAddressValid
          }
        )
        .required('Required'),
      memo: Yup.string().max(MESSAGE_SIZE, 'Your message is too long').required('Memo is required field')
    },
    ['recipient', 'memo']
  )
}

export const validateForm = ({ balanceZec, shippingData }) => values => {
  let errors = {}
  if (balanceZec.isLessThan(networkFee)) {
    errors['amountZec'] = `Your ZEC balance is to low for sending a message`
  }
  if (
    values.memo.length > MESSAGE_SIZE
  ) {
    errors['memo'] = `Your message and shipping information are too long`
  }
  return errors
}

export const SendMessageSeparateMain = ({
  initialValues,
  open,
  users,
  nickname,
  balanceZec,
  userData,
  sendMessageHandler,
  sendPlainTransfer,
  handleClose,
  feeZec = networkFee,
  openSentFundsModal
}) => {
  return (
    <Formik
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        console.log('sending')
      }}
      validationSchema={formSchema(users)}
      initialValues={{
        ...initialValues
      }}
      validate={validateForm({ balanceZec })}
    >
      {({
        values,
        isValid,
        submitForm,
        resetForm,
        errors,
        touched,
        setFieldValue
      }) => {
        return (
          <Modal
            open={open}
            handleClose={handleClose}
          >
            <AutoSizer>
              {({ width, height }) => (
                <Scrollbars
                  autoHideTimeout={500}
                  style={{ width: width, height: height }}
                >
                  <SendMessageInitial
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    memo={values.memo}
                    users={users}
                    nickname={nickname}
                    balanceZec={balanceZec}
                    isValid={isValid}
                    submitForm={submitForm}
                    resetForm={resetForm}
                    feeZec={feeZec}
                    handleClose={handleClose}
                    amountZec={values.amountZec}
                    amountUsd={values.amountUsd}
                    recipient={values.recipient}
                    openSentFundsModal={openSentFundsModal}
                  />
                </Scrollbars>
              )}
            </AutoSizer>
          </Modal>
        )
      }}
    </Formik>
  )
}

SendMessageSeparateMain.propTypes = {
  classes: PropTypes.object.isRequired,
  initialValues: PropTypes.shape({
    recipient: PropTypes.string.isRequired,
    sendAnonymously: PropTypes.bool.isRequired,
    memo: PropTypes.string.isRequired
  }).isRequired,
  balanceZec: PropTypes.instanceOf(BigNumber).isRequired,
  nickname: PropTypes.string.isRequired,
  rateUsd: PropTypes.instanceOf(BigNumber).isRequired,
  rateZec: PropTypes.number.isRequired,
  feeZec: PropTypes.number,
  feeUsd: PropTypes.number,
  handleClose: PropTypes.func.isRequired,
  sendPlainTransfer: PropTypes.func.isRequired,
  openSentFundsModal: PropTypes.func.isRequired
}

SendMessageSeparateMain.defaultProps = {
  initialValues: {
    recipient: '',
    sendAnonymously: false,
    memo: ''
  }
}

export default R.compose(React.memo, withStyles(styles))(SendMessageSeparateMain)
