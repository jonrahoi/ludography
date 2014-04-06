module.exports = function(config){
  config.set({
    basePath : '../',

    files : [
      'web/lib/angular.min.js',
      'web/lib/angular*.js',
      'web/js/app.js',
      'web/js/services.js',
      'web/js/controllers.js',
	  'web/js/filters.js',
      'test/unit/*.js'
    ],

    exclude : [
      'web/js/angular-route*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
