import Ember from "ember";
import { getLogger } from 'ember-logging/utils/logging';

export default Ember.Controller.extend({
  init() {
    const logger = getLogger("ember-logging.controllers.application");
    logger.debug("debug");
    logger.log("log");
    logger.info("info");
    logger.warn("warn");
    logger.error("error");
    return this._super(...arguments);
  }
});