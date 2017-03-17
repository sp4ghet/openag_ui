/*
Shared module for creating loading progress bars.
*/
import {html, forward, Effects, thunk} from 'reflex';
import {merge} from './prelude';
import {classed} from './attr';
import {cursor} from './cursor';
import {update as updateUnknown} from './unknown';

// Loading/loaded actions hide and show the progress bar.
export const Loading = {type: 'Loading'};
export const Loaded = {type: 'Loaded'};

export const init = () => [
  {
    isLoading: false
  },
  Effects.none
];

export const update = (model, action) =>
  action.type === 'Loading' ?
  [merge(model, {isLoading: true}), Effects.none] :
  action.type === 'Loaded' ?
  [merge(model, {isLoading: false}), Effects.none] :
  updateUnknown(model, action);

export const view = (model, address) =>
  html.div({
    className: classed({
      'progress': true,
      'progress-is-loading': model.isLoading
    })
  });