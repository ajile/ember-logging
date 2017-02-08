import Raven from "raven";
import { DEFAULT_OPTIONS } from 'ember-logging/utils/logging';

/**
 * @module ember-logging/utils/logging/handlers/sentry
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
  var isCritical = options.level === "critical";
  if (options.level === "warn") {
    options.level = "warning";
  }
  if (options.level === "critical") {
    options.level = "error";
  }

  Raven.captureMessage(message, options);

  if (isCritical) {
    Raven.showReportDialog();
  }
}
