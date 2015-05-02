define(['adaptor'], function (adaptor) {

  /**
   * [Plotter Es el prototipo base para definir a los plotters especificos,
   * que varian segun el tipo de AmChart que se desea generar y como se 
   * mostraran los datos.]
   * 
   * @param {[type]} amChartHTMLContainer [description]
   * @param {[type]} keys                 [description]
   * @param {[type]} amChartParams        [description]
   */
  function Plotter(amChartHTMLContainer, keys, amChartParams) {
    this.chart = {} ;
    this.amChartParams = amChartParams || {} ;
    this.keys = keys  || [] ;
    this.amChartHTMLContainer = amChartHTMLContainer || "";
    this.adaptor = new adaptor();
    this.dataProvider = {} ;
  }

  //tag: string
  //values: json
  Plotter.prototype.addGraph = function (tag, values) {
    // TODO Lanzar una excepcion diciendo que no esta definido el metodo.
  };

  Plotter.prototype.removeGraph = function (tag) {
    for (var i = 0; i<this.chart.graphs.length; i++){
      if (this.chart.graphs[i].valueField==tag){
        this.chart.removeGraph(this.chart.graphs[i]);
      }
    }
  };

  Plotter.prototype.build = function (keys) {
    this.chart = AmCharts.makeChart(
      this.amChartHTMLContainer, 
      this.amChartParams
    );    
    this.keys = keys ;
    this.dataProvider = this.adaptor.generateDataProvider(this.keys); 
  };
  
  return Plotter  ;
});