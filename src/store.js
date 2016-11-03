/*@flow*/
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import devTools from 'remote-redux-devtools'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import routing from './reducers/routing'
import fetching from './reducers/fetching'

import { watchCountries } from './data/saga'

const reducers = combineReducers({routing, fetching})

const sagaMiddleware = createSagaMiddleware()

const middleware = compose(
  applyMiddleware(createLogger(), sagaMiddleware),
  devTools()
)

const store = createStore(reducers, middleware)
export default store
sagaMiddleware.run(watchCountries)