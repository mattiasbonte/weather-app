(() => {
  let placesAutocompleteLeft = places({
    appId: 'plYSY0KWZ9PR',
    apiKey: 'a56bfe8588a8d32b2c46be6bdaa2f300',
    container: document.querySelector('#inputLeft'),
    templates: {
      value: function (suggestion) {
        return `${suggestion.name}, ${suggestion.countryCode.toUpperCase()}`;
      },
    },
  }).configure({
    type: 'city',
  });

  let placesAutocompleteRight = places({
    appId: 'plYSY0KWZ9PR',
    apiKey: 'a56bfe8588a8d32b2c46be6bdaa2f300',
    container: document.querySelector('#inputRight'),
    templates: {
      value: function (suggestion) {
        return `${suggestion.name}, ${suggestion.countryCode.toUpperCase()}`;
      },
    },
  }).configure({
    type: 'city',
  });
})();
