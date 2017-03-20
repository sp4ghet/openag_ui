/*
This module creates an outbox for outgoing requests that will need to be
retried if they fail.
*/
import {Effects} from 'reflex';
import * as Unknown from '../common/unknown';
import {merge} from '../common/prelude';

// Re-export values from loadash. We need a method to get an array of values
// from the outbox. By re-exporting, we leave open the option of changing the
// data structure later without changing the API.
export {default as values} from 'lodash/values';

// Get value at ID.
// By exporting this function, we leave open the option of changing the
// data structure later.
export const get = (model, id) => model[id];

// Add to the outbox
export const Add = (id, value) => ({
  type: 'Add',
  id,
  value
});

// Remove from outbox
export const Remove = id => ({
  type: 'Remove',
  id
});

export const init = () => [
  {},
  Effects.none
];

export const update = (model, action) =>
  action.type === 'Add' ?
  add(model, action.id, action.value) :
  action.type === 'Remove' ?
  remove(model, action.id) :
  Unknown.update(model, action);

const add = (model, id, value) => [
  merge(model, {
    [id]: value
  }),
  Effects.none
];

const remove = (model, id, value) => [
  merge(model, {
    [id]: void(0)
  }),
  Effects.none
];