let configuration = {};

export function setConfiguration(settings) {
  for (var i in settings) {
    if (settings.hasOwnProperty(i)) {
      configuration[i] = settings[i];
    }
  }
  configuration = settings;
}

export default configuration;
