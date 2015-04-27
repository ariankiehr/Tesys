requirejs.config({
  baseUrl: 'js',
  paths: {
    'extractor': 'elasticsearch/extractor',
    'tesys': 'tesys/connector',
    'handlers': 'apps/handlers/hindex',
    'handlers.config': 'apps/handlers/hconfig',
    'app': 'apps/app',
    'app.config': 'apps/app-config',
    'adaptor': 'charts/chartAdaptor',
    'bar': 'charts/barPlotter',
    'radar': 'charts/radarPlotter',
    'jquery': 'libs/jquery-1.11.2.min',
    'bootstrap': 'libs/bootstrap.min',
    'underscore': 'libs/underscore-min',
    'backbone': 'libs/backbone-min',
    'backbone-relational':'libs/backbone-relational',
    'amcharts': 'libs/amcharts/amcharts',
    'amcharts.radar': 'libs/amcharts/radar',
    'amcharts.serial': 'libs/amcharts/serial',
    'parser': 'parser',
    'model': 'apps/models/model',
    'view': 'apps/views/view'

  },

  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone-relational' : {
        deps: ['backbone']
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'amcharts': {
      exports: 'AmCharts',
      init: function() {
        AmCharts.isReady = true;
      }
    },
    'amcharts.radar': {
      deps: ['amcharts'],
      exports: 'AmCharts',
      init: function() {
        AmCharts.isReady = true;
      }
    },
    'amcharts.serial': {
      deps: ['amcharts'],
      exports: 'AmCharts',
      init: function() {
        AmCharts.isReady = true;
      }
    },
    'radar': {
      deps: ['adaptor'],
      exports: 'radar'
    },
    'bar': {
      deps: ['adaptor'],
      exports: 'bar'
    }
  }
});