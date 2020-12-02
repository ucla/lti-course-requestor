/* eslint-disable react/prop-types */
import React from 'react';
// Before mounting your React application:
import theme from '@instructure/canvas-theme';

import IndexForm from '../indexform';

theme.use({ overrides: { colors: { brand: 'red' } } });

const App = () => (
  <div>
    <IndexForm />
  </div>
);
export default App;
