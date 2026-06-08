module.exports = function (config) {
  config.set({
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ngx-giscus'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'lcov' }, { type: 'text-summary' }],
    },
  });
};
