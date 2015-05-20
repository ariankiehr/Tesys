requirejs.config({
  baseUrl: 'js',
  paths: {
    'tesys': 'tesys/connector',
    'app': 'apps/app',
    'adaptor': 'charts/chartAdaptor',
    'plotter': 'charts/plotter',
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
    'tablesorter': 'libs/tablesorter/jquery.tablesorter.js',
    'model': 'apps/models/model',
    'view': 'apps/views/view',
    'recomendationview': 'apps/views/recomendationview'
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
      deps: ['adaptor', 'plotter'],
      exports: 'radar'
    },
    'bar': {
      deps: ['adaptor', 'plotter'],
      exports: 'bar'
    }
  }
});