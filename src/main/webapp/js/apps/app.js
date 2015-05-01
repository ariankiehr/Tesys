define(
  [ 'jquery', 
    'tesys',  
    'model', 
    'view', 
    'bar',
    'radar',
    'extractor',
    'parser'
  ], 
  function($, 
    tesys, 
    model, 
    view,
    bar,
    radar,
    extractor
  ) {
	
	/* Main function */
  var start = function() {
    //TODO arreglar el sig bug. Cuand se elije un nuevo issue para graficar, 
    //desaparece el grafico que esta en el panel inactivo. Esto se debe a 
    //que AmCharts no puede graficar sobre un tab inactivo.
    var metricsToPlot = { array:[] };
    var skillsToPlot = { array:[] };
    
    // Definicion de objetos encargados de graficar sobre la UI (plotters)
    var metricsPlotter = new bar("metricChart");
    var skillPlotter = new radar("skillChart");

    // Definicion de Modelos.
    var developers = new model.DeveloperCollection();
    var metrics = new model.MetricCollection() ;
    var skills = new model.MetricCollection() ;

    // Definicion de Vistas.
    var devListView = new view.DeveloperCollectionView(
        { collection: developers, 
          plotter: [metricsPlotter, skillPlotter],
          attrToPlot: ['metrics', 'skills']
        }
    );
    var metricsView = new view.MetricCollectionView(
          { collection: metrics, 
            el: $('#metrics'), 
            metricsToPlot: metricsToPlot,
            plotter: metricsPlotter,
            type: 'metrics'
          }
    );
    var mview = new view.MetricSelectView(
          { collection: metrics,
            el: $('#submitMetricSelect') 
          }
    );
    var skillsView = new view.MetricCollectionView(
          { collection: skills, 
            el: $('#skills'), 
            metricsToPlot: skillsToPlot,
            plotter: skillPlotter,
            type: 'skills'
    });
    var developersSelectView = new view.DeveloperSelectView(
          { collection: developers,
            el: $('#puntuado'),
            elIssues: $('#issues')
          }
    );

    // Extraccion de los datos desde Tesys al modelo de la UI
    tesys.getAnalysis(function(data){
      developers.reset(data);
    });
    tesys.getMetrics(function(data){
      metrics.reset(data);
    });
    tesys.getSkills(function(data){

      //adapt skills to metrics format
      var adaptedData = [];
      $.each(data, function(index, el) {
        adaptedData.push({'key': el.skillName, 'nombre': el.skillName});
      });
      skills.reset(adaptedData);
    });
    
    // Punctuation Form
    // Hacer que '#puntuador' extraiga los users del Jira

    $('#submitPunctuation').click(function() {
      extractor.score(
        $('#puntuador').val(), 
        $('#puntuado').val(),
        $('#issues').val(),
        $('#puntuacion').val()
      ); 
    });

    // Complex metrics form

    //extractor.getMetrics('#submitMetricSelect') ;
  $('#submitMetricBtnAddMetric').click(function() {
    // Appends metric into complex metric function
    $('#submitMetricFunction').val($('#submitMetricFunction').val() + " " + $('#submitMetricSelect').find('option:selected').val()) ;
  });

  $('#submitMetricBtnSend').click(function () { 
    try {
      var result = parser.parse($("#submitMetricFunction").val());
      
      var tosend = "{\"key\": \"" + $("#submitMetricId").val() + "\"," +
              "\"nombre\": \"" + $("#submitMetricName").val() + "\"," +
              "\"descripcion\": \"" + $("#submitMetricDescription").val() + "\"," +
              "\"procedencia\": \"" + $("#submitMetricProcedence").val() + "\"," +
               result + "}";  

      $.ajax({
          url: location+'/rest/controller/newmetric',
          type: 'post',
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          success: function (data) {
            markers = JSON.stringify(data);
            $("#submitMetricSpan").html(markers);
          },
          data: tosend
        });          
    } catch (e) {
      $("#submitMetricSpan").html(String(e));
    }
  });

  //Sonar Analysis Submit
    $('#submitAnalysisBtnSend').click(function(event) {
      extractor.storeAnalysis(
        $('#submitAnalysisUrl').val(), 
        $('#submitAnalysisUser').val(),
        $('#submitAnalysisPass').val(),
        $('#submitAnalysisRepo').val(),
        $('#submitAnalysisRev').val(),
        $('#submitAnalysisKey').val()
      ); 
    });
  };

  return { 
    'start': start 
  };
	
});