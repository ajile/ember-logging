import { DEFAULT_OPTIONS } from 'ember-logging/utils/logging';

/**
 * @module ember-logging/utils/logging/handlers/console
 */

/**
 * @method
 * @memberof module:ember-logging/utils/logging~handlers
 * @param {String} message  The title of the message (it should not contain
 *                          sensetive data like ids, names and so on, because
 *                          the messages are grouping together by name)
 * @param {Object} options
 * @param {String} options.logger="unknown"
 * @param {String} options.extra={}
 */
export default function(message, options=DEFAULT_OPTIONS) {
  var level = options.level;
  level = level === "debug" ? "log" : level;
  level = level === "critical" ? "error" : level;
  const fn = window.console && window.console[level] || (() => { });
  fn(`[${options.logger.toUpperCase()}] ${message}`, options.extra);
}
