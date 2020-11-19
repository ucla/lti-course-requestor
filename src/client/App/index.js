/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
// Before mounting your React application:
import theme from '@instructure/canvas-theme';
import './app.css';

import IndexForm from '../indexform';
import Alert from '../instructureComponents/alert';
import AlertContext from '../Contexts/alertContexts';

theme.use({ overrides: { colors: { brand: 'red' } } });

const App = () => {
  const alert = useContext(AlertContext);
  console.log(alert);
  return (
    <div>
      {/* <AlertContext.Consumer>
      {({ alertMsg, alertType, isPersist }) => (
        <Alert
          alertMsg={alertMsg}
          alertType={alertType}
          isPersist={isPersist}
        />
      )}
    </AlertContext.Consumer> */}
      <IndexForm />
    </div>
  );
};
export default App;
