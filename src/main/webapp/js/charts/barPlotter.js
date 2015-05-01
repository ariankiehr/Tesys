define(['adaptor', 'amcharts.serial'], function (adaptor, AmCharts) {

  //Constant definitions
  var DEFAULT_PARAM = {    
        "type": "serial",
        "categoryField": "skill",
        "gridAboveGraphs": true,
        "valueAxes": [{
            "gridColor":"#FFFFFF",
            "gridAlpha": 0.2,
            "dashLength": 0,
            "tickPosition":"start",
            "tickLength":20,
            "axisTitleOffset": 20,
            "min": 0,
            "max": 1,
            "minMaxMultiplier": 1,
            "axisAlpha": 0.15 //hace mas clara u oscura la linea de los ejes
        }]   
  };

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
  function BarChartPlotter(amChartHTMLContainer, keys, amChartParams) {
    this.amChartParams = amChartParams || DEFAULT_PARAM;
    this.keys = keys || [] ;
    this.amChartHTMLContainer = amChartHTMLContainer;
    this.chart = AmCharts.makeChart(this.amChartHTMLContainer, this.amChartParams);
    this.adaptor = new adaptor() ;
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