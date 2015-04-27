define(['adaptor', 'amcharts.serial'], function (adaptor, AmCharts) {

  /**
   * [BarChartPlotter Similar al RadarChartPlotter, solo que no normaliza los
   * datos, osea que los valores de los vectores en cada grafico son dibujados
   * con los valores originales.
   * La descripcion de los parametros y metodos son identicos que los de
   * RadarChartPlotter]
   * 
   * @param {[type]} amChartHTMLContainer [description]
   * @param {[type]} amChartParams        [description]
   * @param {[type]} keys                 [description]
   */
  function BarChartPlotter(amChartHTMLContainer, amChartParams, keys) {
    this.chart = AmCharts.makeChart(amChartHTMLContainer, amChartParams);
    this.amChartParams = amChartParams;
    this.amChartHTMLContainer = amChartHTMLContainer;
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

  BarChartPlotter.prototype.removeGraph = function (tag) {
    for (var i = 0; i<this.chart.graphs.length; i++){
      if (this.chart.graphs[i].valueField==tag){
        this.chart.removeGraph(this.chart.graphs[i]);
      }
    }
  };

  BarChartPlotter.prototype.build = function (keys) {
    this.chart = AmCharts.makeChart(
      this.amChartHTMLContainer, 
      this.amChartParams
    );
    this.keys = keys ;
    this.dataProvider = this.adaptor.generateDataProvider(this.keys);    
  };
  
  return BarChartPlotter  ;
});