import React from 'react';
import { Alert } from '@instructure/ui-alerts';
import AlertConstants from '../Constants/alertConstants';
import AlertContext from '../Contexts/alertContexts';
/**
 * @returns {object} alert
 * // errorMsg
 * // errorType
 * // isPersist
 *
 */

/**
 * @param root0
 * @param root0.isPersist
 * @param root0.alertMsg
 * @param root0.alertType
 */
function alert({ alertMsg = '', alertType = '', isPersist = false }) {
  const defaultAlertLevel = AlertConstants.WARN;
  let alertVariant = alertType;
  if (!AlertConstants[alertType.toUpperCase()]) {
    alertVariant = defaultAlertLevel;
  }
  const timeout = isPersist ? 0 : 3000;
  console.log('Alert context');
  return (
    <div>
      <Alert
        variant={alertVariant}
        renderCloseButtonLabel="Close"
        margin="small"
        transition="none"
        timeout={timeout}
      >
        {alertMsg}
      </Alert>
    </div>
  );
}
export default alert;
