// @note this file is probably temporary, since authoring recipe JSON by
// hand is a pain.
import {html, forward, Effects, thunk} from 'reflex';
import * as Config from '../../openag-config.json';
import * as Banner from '../common/banner';
import * as Progress from '../common/progress';
import * as Request from '../common/request';
import * as Unknown from '../common/unknown';
import * as Template from '../common/stache';
import {localize} from '../common/lang';
import {merge, tag, batch, port} from '../common/prelude';
import {cursor} from '../common/cursor';
import {classed} from '../common/attr';
import * as Input from '../common/input';
import {compose} from '../lang/functional';
import * as Recipes from '../recipes';

// Action tagging functions

const TextareaAction = tag('Textarea');

// Actions

export const Configure = (origin) => ({
  type: 'Configure',
  origin
});

export const Back = {
  type: 'Back'
};

// Action to send up to parent, notifying of recipe added to DB.
const ReceiptAddRecipe = recipe => ({
  type: 'ReceiptAddRecipe',
  recipe
});

// Put request action
const Put = (url, body) => ({
  type: 'Put',
  url,
  body
});

// Put request response
const Putted = result => ({
  type: 'Putted',
  result
});

// Submitting the form
export const Submit = recipe => ({
  type: 'Submit',
  recipe
});

export const Cancel = {
  type: 'Cancel'
};

export const Clear = TextareaAction(Input.Clear);

const TagBanner = source => ({
  type: 'Banner',
  source
});

export const Alert = compose(TagBanner, Banner.AlertDismissable);
export const Notify = compose(TagBanner, Banner.Notify);
export const AlertInvalid = TagBanner(Banner.AlertDismissable("Uh-oh! Invalid JSON."));

// Attempt to publish a recipe to the database.
const Publish = recipe => ({
  type: 'Publish',
  recipe
});

const TagProgress = source => ({
  type: 'Progress',
  source
});

const Loading = TagProgress(Progress.Loading);
const Loaded = TagProgress(Progress.Loaded);

// Init and update functions

export const init = () => {
  const placeholder = localize('Paste recipe JSON...');
  const [textarea, textareaFx] = Input.init('', null, placeholder);
  const [banner, bannerFx] = Banner.init();
  const [progress, progressFx] = Progress.init();

  return [
    {
      origin: null,
      isOpen: false,
      banner,
      textarea,
      progress
    },
    textareaFx.map(TextareaAction),
    bannerFx.map(TagBanner),
    progressFx.map(TagProgress)
  ];
};

// Update functions

export const update = (model, action) =>
  action.type === 'Banner' ?
  updateBanner(model, action.source) :
  action.type === 'Textarea' ?
  updateTextarea(model, action.source) :
  action.type === 'Progress' ?
  updateProgress(model, action.source) :
  action.type === 'Submit' ?
  submit(model, action.recipe) :
  action.type === 'Put' ?
  put(model, action.url, action.body) :
  action.type === 'Putted' ?
  (
    action.result.isOk ?
    puttedOk(model, action.result.value) :
    puttedError(model, action.result.error)
  ) :
  action.type === 'Publish' ?
  publish(model, action.recipe) :
  action.type === 'Configure' ?
  [merge(model, {origin: action.origin}), Effects.none] :
  Unknown.update(model, action);

const submit = (model, recipeString) => {
  // We send an Effect up so that if an error is caused further down the line,
  // it doesn't get caught by this try block.
  try {
    const recipe = JSON.parse(recipeString);
    return [model, Effects.receive(Publish(recipe))];
  } catch (e) {
    return [model, Effects.receive(AlertInvalid)];
  }
}

const publish = (model, recipe) =>
  batch(update, model, [
    Loading,
    Put(templateRecipePut(model.origin, recipe._id), recipe)
  ]);


const put = (model, url, body) => [
  model,
  Request.put(url, body).map(Putted)
];

const puttedOk = (model, recipe) => {
  // Cleanup
  const [next, fx] = batch(update, model, [
    Loaded,
    Clear
  ]);

  return [
    next,
    Effects.batch([
      fx,
      // Notify parent
      Effects.receive(ReceiptAddRecipe(recipe))
    ])
  ];
}

const puttedError = (model, error) =>
  batch(update, model, [
    Loaded,
    Alert(String(error))
  ]);

const updateTextarea = cursor({
  get: model => model.textarea,
  set: (model, textarea) => merge(model, {textarea}),
  tag: TextareaAction,
  update: Input.update
});

const updateBanner = cursor({
  get: model => model.banner,
  set: (model, banner) => merge(model, {banner}),
  tag: TagBanner,
  update: Banner.update
});

const updateProgress = cursor({
  get: model => model.progress,
  set: (model, progress) => merge(model, {progress}),
  update: Progress.update,
  tag: TagProgress
});

// View

export const view = (model, address, isActive) => {
  const sendBack = onBack(address);
  const sendSubmit = onSubmit(address);
  return html.div({
    className: classed({
      'panel--main': true,
      'panel--lv1': true,
      'panel--main-close': !isActive
    })
  }, [
    html.header({
      className: 'panel--header'
    }, [
      html.h1({
        className: 'panel--title'
      }, [
        localize('Import Recipe')
      ]),
      html.div({
        className: 'panel--nav-left'
      }, [
        html.a({
          className: 'recipes-back-icon',
          onTouchStart: sendBack,
          onMouseDown: sendBack
        })
      ]),
      html.div({
        className: 'panel--nav-right'
      }, [
        html.button({
          className: 'btn-panel',
          type: 'submit',
          onTouchStart: sendSubmit,
          onMouseDown: sendSubmit
        }, [
          localize('Save')
        ])
      ])
    ]),
    thunk(
      'recipes-progress',
      Progress.view,
      model.progress,
      forward(address, TagProgress)
    ),
    thunk(
      'recipe-form-banner',
      Banner.view,
      model.banner,
      forward(address, TagBanner),
      'rform-banner'
    ),
    html.div({
      className: 'panel--content'
    }, [
      html.div({
        className: 'rform-main'
      }, [
        html.form({
          className: 'rform-form'
        }, [
          thunk(
            'textarea',
            Input.viewTextarea,
            model.textarea,
            forward(address, TextareaAction),
            'rform-textarea',
            'rform-textarea txt-textarea'
          )
        ])
      ])
    ])
  ]);
}

const onSubmit = port(event => {
  // @TODO create a proper input module instead of kludging this in a
  // brittle way. We want to be able to send an Effect that will
  // focus, unfocus. We also want to read value changes from `onInput`.
  // See https://github.com/browserhtml/browserhtml/blob/master/src/common/ref.js
  // https://gist.github.com/Gozala/2b6a301846b151aafe807104304dbd06#file-focus-js
  event.preventDefault();
  const el = document.querySelector('#rform-textarea');
  return Submit(el.value);
});

const onBack = port(event => {
  event.preventDefault();
  return Back;
})

const templateRecipePut = (origin, id) =>
  Template.render(Config.recipes.doc, {
    origin_url: origin,
    id
  });