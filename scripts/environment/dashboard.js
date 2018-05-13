/*
The dashboard displays the latest camera information from the Food Computer.
*/
import {html, forward, Effects, Task, thunk} from 'reflex';
import {
  environmental_data_point as ENVIRONMENTAL_DATA_POINT,
  demo as DEMO
} from '../../openag-config';
import * as Request from '../common/request';
import {compose, constant} from '../lang/functional';
import {render as renderTemplate} from '../common/stache';
import {update as updateUnknown} from '../common/unknown';
import {localize} from '../common/lang';
import * as Sidebar from './dashboard/sidebar';

const REFRESH_TIMEOUT = 3 * 1000;

// Actions

const RequestOpenRecipes = {
  type: 'RequestOpenRecipes'
};

// Signal that the component has finished loading.
// This can be used by the parent component to tell the dashboard that an update
// will not be coming.
export const FinishLoading = {type: 'FinishLoading'};

// Send a doc describing aerial image to update.
// We'll still need to fetch the attachment itself.
export const UpdateAerialImage = doc => ({
  type: 'UpdateAerialImage',
  doc
});

export const SetRecipe = (id, name, hasTimelapse) => ({
  type: 'SetRecipe',
  id,
  name,
  hasTimelapse
});

const hasTimelapseAttachment = doc => (
  doc._attachments &&
  doc._attachments.timelapse &&
  doc._attachments.timelapse.content_type
);

// Decode recipe document into SetRecipe action
export const decodeRecipe = doc =>
  SetRecipe(
    doc._id,
    (doc.name || doc.value || doc._id),
    hasTimelapseAttachment(doc)
  );

export const Configure = (root, origin) => ({
  type: 'Configure',
  root,
  origin
});

export const TagSidebar = action =>
  action.type === 'RequestOpenRecipes' ?
  RequestOpenRecipes :
  SidebarAction(action);

const SidebarAction = action => ({
  type: 'Sidebar',
  source: action
});

const SetSidebarRecipe = compose(SidebarAction, Sidebar.SetRecipe);
export const SetAirTemperature = compose(SidebarAction, Sidebar.SetAirTemperature);

const RefreshImg = {type: 'RefreshImg'};
const GetLatest = {type: 'GetLatestImage'};

const AlwaysGetLatest = constant(GetLatest);
const AlwaysRefreshImg = constant(RefreshImg);

// Init and update

class Model {
  constructor(
    timestamp,
    root,
    origin,
    recipeStartID,
    hasTimelapse,
    isLoading,
    sidebar,
    imageID
  ) {
    this.timestamp = timestamp;
    this.root = root;
    this.origin = origin;
    this.recipeStartID = recipeStartID;
    // We have to deal with 3 states:
    //
    // 1. Loading (waiting for data to come back). Show a spinner.
    // 2. Loaded, but no recipe start exists.
    // 3. Loaded recipe start, but no video attached.
    this.hasTimelapse = hasTimelapse;
    this.isLoading = isLoading;
    this.sidebar = sidebar;
    this.imageID = imageID;
  }
}

export const init = () => {
  const [sidebar, sidebarFx] = Sidebar.init();
  const hasTimelapse = false;
  const isLoading = true;

  return [
    new Model(
      Date.now(),
      null,
      null,
      null,
      hasTimelapse,
      isLoading,
      sidebar,
      null
    ),
    Effects.receive(GetLatest)
  ];
}

export const update = (model, action) =>
  action.type === 'UpdateAerialImage' ?
  // @HACK for wfp demo... pass
  [model, Effects.none] :
  action.type === 'GetLatestImage' ?
  FindLatestImageUUID(model) :
  action.type === 'SwapImageID' ?
  swapImageID(model, action.uuid) :
  action.type === 'RefreshImg' ?
  refreshImg(model, action.view) :
  action.type === 'Sidebar' ?
  delegateSidebarUpdate(model, action.source) :
  action.type === 'SetRecipe' ?
  setRecipe(model, action.id, action.name) :
  action.type === 'Configure' ?
  configure(model, action.root, action.origin) :
  action.type === 'FinishLoading' ?
  finishLoading(model) :
  updateUnknown(model, action);

const ParseImageUUID = (view) => {
  const image = view.value.rows.find(row => row.key[2] === 'aerial_image')
  console.log(image)
  return ({
  type: 'SwapImageID',
  uuid: image.value._id
})}

const FindLatestImageUUID = model => {
  const url = renderTemplate(DEMO.latest_image, {
    origin_url: model.origin
  })

  return [model, Request.get(url).map(ParseImageUUID)]
}

const setRecipe = (model, id, name) => {
  // Update sidebar model with id and name
  const [sidebar, sidebarFx] = Sidebar.update(
    model.sidebar,
    Sidebar.SetRecipe(id, name)
  );

  const isLoading = false;

  // Create new model with id and new sidebar model
  const next = new Model(
    model.timestamp,
    model.root,
    model.origin,
    id,
    model.hasTimelapse,
    isLoading,
    sidebar,
    model.imageID
  );

  // return next model and make sure to map sidebarFx.
  return [next, sidebarFx.map(TagSidebar)];
}

// Configure origin url on model
const configure = (model, root, origin) => [
  new Model(
    model.timestamp,
    root,
    origin,
    model.recipeStartID,
    model.hasTimelapse,
    model.isLoading,
    model.sidebar,
    model.imageID
  ),
  Effects.none
];

// Flag initial loading state as finished.
const finishLoading = model => [
  new Model(
    model.timestamp,
    model.root,
    model.origin,
    model.recipeStartID,
    model.hasTimelapse,
    // Set loading to false.
    false,
    model.sidebar,
    model.imageID
  ),
  Effects.none
];

const refreshImg = (model, uuid) => [
  new Model(
    Date.now(),
    model.root,
    model.origin,
    model.recipeStartID,
    model.hasTimelapse,
    model.isLoading,
    model.sidebar,
    model.imageID
  ),
  Effects.perform(Task.sleep(REFRESH_TIMEOUT)).map(GetLatest)
];

const swapImageID = (model, imageID) => [
  new Model(
    model.timestamp,
    model.root,
    model.origin,
    model.recipeStartID,
    model.hasTimelapse,
    model.isLoading,
    model.sidebar,
    imageID
  ),
  Effects.perform(Task.sleep(REFRESH_TIMEOUT)).map(AlwaysRefreshImg)
];

const swapSidebar = (model, [sidebar, fx]) => [
  new Model(
    model.timestamp,
    model.root,
    model.origin,
    model.recipeStartID,
    model.hasTimelapse,
    model.isLoading,
    sidebar,
    model.imageID
  ),
  fx.map(TagSidebar)
];

const delegateSidebarUpdate = (model, action) =>
  swapSidebar(model, Sidebar.update(model.sidebar, action));

// View

export const view = (model, address) =>
  model.isLoading ?
  viewLoading(model, address) :
  viewReady(model, address);

const viewReady = (model, address) =>
  html.div({
    className: 'dashboard-view split-view'
  }, [
    thunk(
      'dashboard-sidebar',
      Sidebar.view,
      model.sidebar,
      forward(address, TagSidebar)
    ),
    html.div({
      className: 'dashboard-content split-view-content'
    }, [
      html.div({
        className: 'timelapse--mask'
      }, [
        html.img({
          className: 'timelapse--video',
          src: templateImgUrl(model)
        })
      ])
    ])
  ]);

const viewLoading = (model, address) =>
  html.div({
    className: 'dashboard-view split-view'
  }, [
    thunk(
      'dashboard-sidebar',
      Sidebar.view,
      model.sidebar,
      forward(address, TagSidebar)
    ),
    html.div({
      className: 'dashboard-content split-view-content split-view-content--loading'
    }, [
    ])
  ]);

const viewEmpty = (model, address) =>
  html.div({
    className: 'dashboard-view split-view'
  }, [
    thunk(
      'dashboard-sidebar',
      Sidebar.view,
      model.sidebar,
      forward(address, TagSidebar)
    ),
    html.div({
      className: 'dashboard-content split-view-content'
    }, [
      html.div({
        className: 'dashboard-camera-plug'
      }, [
        html.img({
          src: 'assets/camera.svg',
          className: 'dashboard-camera-plug--icon'
        }),
        html.span({}, [
          localize('No camera data yet')
        ])
      ])
    ])
  ]);

// Utils
const templateImgUrl = model =>
  renderTemplate(DEMO.image_url, {
    origin_url: model.origin,
    latest_image: model.imageID
  });

const templateVideoUrl = model =>
  renderTemplate(ENVIRONMENTAL_DATA_POINT.timelapse, {
    origin_url: model.origin,
    recipe_start_id: model.recipeStartID
  });
