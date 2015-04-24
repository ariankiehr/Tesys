define(["adaptor"], function (adaptor) {
/**
    Actualiza un Chart automaticamente.
*/
  // var chartAdapt = require('charts/chartAdaptor') ;

  //amChart: amChart
  //keys: string[]
  function BarChartPlotter(amChart, keys) {
    this.chart = amChart ;
    this.adaptor = new adaptor() ;
    this.keys = keys ;
    this.dataProvider = this.adaptor.generateDataProvider(this.keys);
  }

  //tag: string
  //values: json
  BarChartPlotter.prototype.addGraph = function (tag, values) {
    this.adaptor.addDataToProvider(tag, values, this.dataProvider) ;
    this.chart.addGraph({
      "balloonText": tag+" [ [[category]] ] = [["+tag+"]] ",
      "fillAlphas": 1, //mas claro u oscuro el relleno del Graph
      "title": "Column graph",
      "type": "column",
      "valueField": tag
    });
    this.chart.dataProvider = this.dataProvider ;
    this.chart.validateData();
    this.chart.animateAgain();
  };

  BarChartPlotter.prototype.build = function (amChart, keys) {
    this.chart = amChart ;
    this.adaptor = new adaptor() ;
    this.keys = keys ;
    this.dataProvider = this.adaptor.generateDataProvider(this.keys);    
  };
  
  return BarChartPlotter  ;
});