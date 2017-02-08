import Raven from "raven";
import { DEFAULT_OPTIONS } from 'ember-logging/utils/logging';

/**
 * @module ember-logging/utils/logging/handlers/backlog
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
  // The statement below used for debugging purpose. Do not delete it!
  // It may be uncommented when you need it, but take care of commit it.
  // window.console.log(`%c[BREADCRUMBS][${options.logger.toUpperCase()}]` +
  //             `${message} ${JSON.stringify(options.extra)}`, "color: #CCC;");
  Raven.captureBreadcrumb({
    category: 'backlog',
    message: [`[${options.logger.toUpperCase()}]`, message].join(" "),
    level: options.level,
    data: options.extra
  });
}
