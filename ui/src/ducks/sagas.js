import { all, fork } from 'redux-saga/effects';
import { nodesSaga } from './app/nodes';
import { podsSaga } from './app/pods';
import { authenticateSaga } from './login';
import { configSaga } from './config';

export default function* rootSaga() {
  yield all([
    fork(nodesSaga),
    fork(podsSaga),
    fork(authenticateSaga),
    fork(configSaga)
  ]);
}
