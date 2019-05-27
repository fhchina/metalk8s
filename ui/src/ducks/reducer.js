import { combineReducers } from 'redux';

import config from './config';
import nodes from './app/nodes';
import pods from './app/pods';
import login from './login';
import layout from './app/layout';
import notifications from './app/notifications';
import alerts from './app/alerts';
import monitoring from './app/monitoring';

const rootReducer = combineReducers({
  config,
  login,
  app: combineReducers({
    nodes,
    layout,
    pods,
    notifications,
    alerts,
    monitoring
  })
});

export default rootReducer;
