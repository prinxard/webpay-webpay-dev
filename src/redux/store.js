import { useMemo } from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './rootReducer';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';

const middleWares = [thunkMiddleware];

// if (process.env.NODE_ENV === 'development') {
//   middleWares.push(logger);
// }

let store;

const initStore = (initialState) => {
  return createStore(reducers, initialState, applyMiddleware(...middleWares));
};

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export const useStore = (initialState) => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);

  const persistor = persistStore(store);
  return { store, persistor };
};
