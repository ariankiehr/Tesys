define(["adaptor"], function (adaptor) {
/**
	Actualiza un Chart automaticamente.
*/

//amChart: amChart
//keys: string[]
//	var chartAdapt = require('charts/chartAdaptor') ;

	function RadarChartPlotter(amChart, keys) {
		this.chart = amChart ;
		this.adaptor = new adaptor() ;
		this.keys = keys ;
	  this.dataProvider = this.adaptor.generateDataProvider(this.keys);
	}

	//tag: string
	//values: json
	//graph: json (amChart addGraph format)
	RadarChartPlotter.prototype.addGraph = function (tag, values) {
		this.adaptor.addDataToProvider(tag, values, this.dataProvider) ;
    this.chart.addGraph({
      "balloonText": tag+" [ [[category]] ] = [["+tag+"]] % (from [[total]]) ",
      "bullet": "round",
      "fillAlphas": 0.3, //mas claro u oscuro el relleno del Graph
      "valueField": tag
    });
		this.chart.dataProvider = this.adaptor.normalizeDataProvider(this.dataProvider) ;
		this.chart.validateData();
		this.chart.animateAgain();
	};

	 RadarChartPlotter.prototype.build = function (amChart, keys) {
		this.chart = amChart ;
		this.adaptor = new adaptor() ;
		this.keys = keys ;
	  this.dataProvider = this.adaptor.generateDataProvider(this.keys); 
  };
  
	return RadarChartPlotter ;

});