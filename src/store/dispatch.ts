import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './store';
import { Action } from 'redux';
import { useDispatch as useReduxDispatch } from 'react-redux';

// Este tipo permite despachar tanto acciones regulares como thunks
type PrJDispatch = ThunkDispatch<RootState, unknown, Action>;

export function usePrJDispatch(): PrJDispatch {
  return useReduxDispatch<PrJDispatch>();
}