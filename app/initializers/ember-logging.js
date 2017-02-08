import Ember from 'ember';
import Config from '../config/environment';
import { setConfiguration } from 'ember-logging/configuration';

export function initialize() {
  setConfiguration(Config);
}

export default {
  name: 'ember-logging',
  initialize: initialize
};
