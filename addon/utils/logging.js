/* eslint no-console: 0 */

import Ember from 'ember';
import Config from 'ember-logging/configuration';
import handlers from 'ember-logging/utils/logging/handlers';

const { merge } = Ember;

/**
 * @module ember-logging/utils/logging
 */

export const DEFAULT_OPTIONS = {
  level: "debug",
  logger: "unknown",
  extra: {}
};


/**
 * Creates and returns new instance of Logger.
 * @function
 * @param {String|Object} options  This param may be a logger name or options
 * @return {module:ember-logging/utils/logging~Logger}
 */
export function getLogger(options) {
  if (Ember.typeOf(options) === "string") {
    return Logger.create({ options: { logger: options } });
  } else {
    return Logger.create(options);
  }
}

/**
 * Method returns first found logger settings by logger name. All logging
 * settings are declared in the environment files.
 * @function
 * @param {String} loggerName  A logger name.
 * @return {Object|Null}
 */
export function getOptionsFor(loggerName) {
  for (let rule in Config["ember-logging"].loggers) {
    if ((new RegExp(rule)).test(loggerName)) {
      return Config["ember-logging"].loggers[rule];
    }
  }
  return null;
}

/**
 * The class able you to log the messages. It may log messages localy (output
 * them to the console) or may send them to a remote (for example to sentry.io).
 *
 * Every logger has own name that helps you to find messages quickly^ because all
 * messages are grouped by logger's name. This type of objects creates for one
 * application aspect. The project may consist of many aspects like: websocket,
 * xhr, some kind of the issue system etc. One logger covers needs of logging
 * for one aspect (it's important).
 *
 * For example you have a websocket subsystem that consist of an
 * `instance-initializer`, `service`, `event-handlers` and maybe something else.
 * To cover objects by logging you should create only one logger called
 * `<projectname>.websocket`. The logger creates so:
 *
 * @example <caption>Creating logger</caption>
 * import { getLogger } from 'ember-logging/utils/logging';
 *
 * const logger = getLogger("dashboard.websocket");
 *
 * @example <caption>Using logger</caption>
 * logger.debug("Low level messages");
 * logger.warn("Some warnings like deprecations");
 * logger.info("Information messages");
 * logger.error("An exception");
 * logger.critical("An fatal error");
 *
 * @class Logger
 */
class Logger extends Ember.Object {

  constructor() {
    const result = super(...arguments);
    this.set("strictHandlers", this.strictHandlers || []);
    return result;
  }

  /**
   * The method gets lowest level messages assigned for debugging purpose on the
   * local machine. For rare cases messages of this level may be sended to
   * the remote logging system. Messages of this type usually ignored in
   * production.
   * @method
   * @memberof module:ember-logging/utils/logging~Logger#
   * @param {String} message  The title of the message (it should not contain
   *                          sensetive data like ids, names and so on, because
   *                          the messages are grouping together by name)
   * @param {Object} extra={}  An object contains additional event data.
   * @return {Boolean}
   */
  debug() {
    return this._send("debug", ...arguments);
  }

  /**
   * Alias to debug method.
   * @method
   * @memberof module:ember-logging/utils/logging~Logger#
   * @param {String} message  The title of the message (it should not contain
   *                          sensetive data like ids, names and so on, because
   *                          the messages are grouping together by name)
   * @param {Object} extra={}  An object contains additional event data.
   * @return {Boolean}
   */
  log() {
    return this.debug(...arguments);
  }  

  /**
   * The method gets info-level messages. The messages of this level helpful for
   * debugging and in rare cases may be sent to the remote logging system.
   * Messages this type usually ignored in production, but not in beta.
   * @method
   * @memberof module:ember-logging/utils/logging~Logger#
   * @param {String} message  The title of the message (it should not contain
   *                          sensetive data like ids, names and so on, because
   *                          the messages are grouping together by name)
   * @param {Object} extra={}  An object contains additional event data.
   * @return {Boolean}
   */
  info() {
    return this._send("info", ...arguments);
  }

  /**
   * The method gets warning messages. The messages of this level helpful for
   * debugging application in long-term perspective. The messages of this type
   * almost always send to remote logging system. This level usually ignored in
   * production, but none of them. In beta environments this level of messages
   * always turned on.
   * @method
   * @memberof module:ember-logging/utils/logging~Logger#
   * @param {String} message  The title of the message (it should not contain
   *                          sensetive data like ids, names and so on, because
   *                          the messages are grouping together by name)
   * @param {Object} extra={}  An object contains additional event data.
   * @return {Boolean}
   */
  warn() {
    return this._send("warn", ...arguments);
  }

  /**
   * The method gets error message or `Error` object. Messages of this level
   * should occures when something unexpected happened in application. This
   * level should be turned on everywhere.
   * @method
   * @memberof module:ember-logging/utils/logging~Logger#
   * @param {String} message  The title of the message (it should not contain
   *                          sensetive data like ids, names and so on, because
   *                          the messages are grouping together by name)
   * @param {Object} extra={}  An object contains additional event data.
   * @return {Boolean}
   */
  error() {
    return this._send("error", ...arguments);
  }

  /**
   * The method gets error message or `Error` object. Messages of this level
   * should occures when something unexpected happened in application that
   * breaks it. Events of this type similar to error type with one difference:
   * on this event the dialog window showing to user that he may fill by the
   * reason of occuring this event.
   * @method
   * @memberof module:ember-logging/utils/logging~Logger#
   * @param {String} message  The title of the message (it should not contain
   *                          sensetive data like ids, names and so on, because
   *                          the messages are grouping together by name)
   * @param {Object} extra={}  An object contains additional event data.
   * @return {Boolean}
   */
  critical() {
    return this._send("critical", ...arguments);
  }

  /**
   * @method
   * @memberof module:ember-logging/utils/logging~Logger#
   * @private
   * @param {String} level  The logging level. It can take following values:
   *                        'debug', 'info', 'warn', 'error', 'critical'.
   * @param {String} message  A title of the event message.
   * @param {Object} extra={}  Additional data.
   * @param {Object} options={}  Event options.
   * @return {module:ember-logging/utils/logging~Logger}
   */
  _send(level, message, extra={}, options={}) {

    options = merge(Ember.copy(options), this.get("options"));
    options = merge({ level, extra }, options);

    // Getting a name of the logger and then the logger itself that should
    // produce the event.
    const loggerName = this.get("options.logger"),
          loggerOptions = getOptionsFor(loggerName);

    // If the logger is not found quiting the method
    if (!loggerOptions) { return false; }

    // Getting options for the handler. The options determines what kind of
    // events and where will be emitted.
    const handlerOptions = loggerOptions["handlers"];

    const strictHandlers = this.get("strictHandlers");

    // Iterating over all handlers that should be invoked on current event
    // type. The handlers invokes sequently. Each of them gets options that were
    // passed when logger's method invoked.
    // The handlers take care about how to execute the event. They may do
    // nothing on them.
    for (let name in handlerOptions) {
      if (!handlerOptions.hasOwnProperty(name)) { continue; }

      // When set concrete handlers prevent execution the handlers that not in
      // the list.
      if (strictHandlers.length && strictHandlers.indexOf(name) === -1) {
        continue;
      }

      // Getting a handler that should execute the event
      let handler = handlers[name];

      // Getting the list of event levels that the `handler` should admit
      let levels = handlerOptions[name];

      // If current event is acceptable level - invoking the handler with it
      if (levels.indexOf(level) >= 0) {
        handler(message, options);
      }
    }

    return this;
  }

  /**
   * Set handlers that shoud execute all events.
   * @method
   *
   * @example
   * const logger = getLogger("dashboard");
   * logger.use("backlog").warn(message);
   *
   * @memberof module:ember-logging/utils/logging~Logger#
   * @param {String} handlerName  The name of the concrete handler
   * @return {module:ember-logging/utils/logging~Logger}
   */
  use(handlerName) {
    return getLogger({
      options: this.get("options"),
      strictHandlers: [ handlerName ]
    });
  }

}

export default { Logger, getLogger };
