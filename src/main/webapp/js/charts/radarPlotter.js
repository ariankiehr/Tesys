define(['adaptor', 'amcharts.radar'], function (adaptor, AmCharts) {

  //Constant definitions
  var DEFAULT_PARAM = {    
        "type": "radar",
        "categoryField": "skill",
        "valueAxes": [{
            "axisTitleOffset": 20,
            "min": 0,
            "max": 1,
            "minMaxMultiplier": 1,
            "axisAlpha": 0.15 //hace mas clara u oscura la linea de los ejes
        }]   
  };

  /**
   * [RadarChartPlotter Muestra graficos en un AmChart con el tipo de grafico
   * radar, un grafico es un conjuntode vectores. En el radar cada grafico 
   * esta normalizado en cada vector de manera que cada vector representa un
   * %100 como valor maximo]
   * 
   * @param {[string]} amChartHTMLContainer 
   * [Id del elemento HTML que contendra el chart]
   * 
   * @param {[json]} amChartParams        
   * [Parametros para la construccion del chart. Ver ejemplo en 
   * "http://docs.amcharts.com/3/javascriptcharts/AmChart"]
   * 
   * @param {[array of string]} keys       
   * [Id de los elementos que seran graficados (cuando se realize por ejemplo 
   * un addGraph(tag, values) el subconjunto de values que se graficaran son 
   * los que pertenezcan al conjunto de keys)]
   */
	function RadarChartPlotter(amChartHTMLContainer, keys, amChartParams) {
    this.amChartParams = amChartParams || DEFAULT_PARAM;
    this.keys = keys || [] ;
    this.amChartHTMLContainer = amChartHTMLContainer;
    this.chart = AmCharts.makeChart(this.amChartHTMLContainer, this.amChartParams) ;
		this.adaptor = new adaptor() ;
	  this.dataProvider = this.adaptor.generateDataProvider(this.keys);
	}

  /**
   * [addGraph Agrega un nuevo grafico al Chart]
   * @param {[string]} tag    
   * [id del grafico]
   * @param {[jsonArray of key:value]} values 
   * [conjunto de valores asociados al grafico, solo se graficaran todos los 
   * values que esten en el arreglo this.keys]
   */
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

  /**
   * [removeGraph elimina un grafico del chart]
   * @param  {[string]} tag [id del grafico a eliminar]
   */
  RadarChartPlotter.prototype.removeGraph = function (tag) {
    for (var i = 0; i<this.chart.graphs.length; i++){
      if (this.chart.graphs[i].valueField==tag){
        this.chart.removeGraph(this.chart.graphs[i]);
      }
    }
  };

  /**
   * [build Vuelve a crear el chart cambiando el conjunto de keys]
   * @param  {[jsonArray of key:value]} keys [ver el parametro keys en el 
   * constructor de la clase]
   */
	RadarChartPlotter.prototype.build = function (keys) {
    this.chart = AmCharts.makeChart(
      this.amChartHTMLContainer, 
      this.amChartParams
    );    
		this.keys = keys ;
	  this.dataProvider = this.adaptor.generateDataProvider(this.keys); 
  };
  
	return RadarChartPlotter ;

});