define(["jquery"], function($) {
  function getAnalysis(callback) {
    $.ajax({
      type: 'GET',
      url: location+'rest/controller/developers/0',
      dataType: 'json', // data type of response
      success: function(data) {
        callback(data) ;
      }
    });
  }

  function getMetrics(callback) {
    $.ajax({
        type: 'GET',
        url: location+'rest/controller/metricsavailable',
        dataType: "json", // data type of response
        success: function (data) {
          callback(data) ;
        }
    });
  }

  function getSkills(callback) {
    $.ajax({
      type: 'GET',
      url: location+'rest/controller/skills',
      dataType: "json", 
      success: function (data) {
        callback(data);
      }
    });
  }


  /**
   * Obtiene las prediccines de los developers de la interfaz del tesys
   * @param  {string} metricName    
   *         nombre de la metrica
   * @param  {float} metricValue   
   *         valor de la metrica
   * @param  {float} pearsonFactor  
   *         factor de correlacion minimo de las metricas a predecir
   * @param  {array of string} skills habilidades requeridas y con respecto a las cuales se predicira
   *  
   */
  function getPredictions(metricName, metricValue, pearsonFactor, skills, callback) {
    var skillQuery = "" ;
    var sprint=2 ; 
    $.each(skills, function(i, skill){
      if (i===0) {
        skillQuery+='?s='+skill;
      } else {
        skillQuery+='&s='+skill;
      }
    });
    $.ajax({
      type: 'GET',
      url: location+'rest/controller/getpredic/'+metricName+'/'+metricValue+'/'+pearsonFactor+'/'+sprint+skillQuery,
      dataType: 'json', // data type of response
      success: function(data) {
        callback(data) ;
      }

    });
  }


  function score(puntuador, puntuado, issue, puntuacion) { 
    var toSend = "{\"puntuador\": \"" + puntuador + "\"," +
              "\"puntuado\": \"" + puntuado + "\"," +
              "\"issue\": \"" + issue + "\"," +
              "\"puntuacion\": \"" + puntuacion + "\"" +"}";

    $.ajax({
        url: location+'rest/controller/punt',
        type: 'PUT',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: toSend,
        success: function (data) {
            //TODO ver casos de error
          alert("Puntuation stored successful");
        }
    });

  }

  function joinMetrics() {
    $.ajax({
        url: location+'rest/controller/analyzer',
        type: 'PUT',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            //TODO ver casos de error
          alert("Tesys analysis successful");
        }
    });   
  }

  function storeAnalysis(sonarUrl, sonarUser, sonarPass, repository, revision, sonarKey) {
      var toSend = "{\"url\": \"" + sonarUrl + "\"," +
          "\"user\": \"" + sonarUser + "\"," +
          "\"pass\": \"" + sonarPass + "\"," +
          "\"repository\": \"" + repository + "\"," +
          "\"revision\": \"" + revision + "\"," +
          "\"sonarKey\": \"" + sonarKey + "\"" +"}";
      $.ajax({
          url: location+'rest/controller/sonar',
          type: 'PUT',
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          data: toSend,
          success: function (data) {
              //TODO ver casos de error
            alert("analysis stored");
          }
      });
  }

  /**
   * Almacena una metrica en el servidor, la misma es definida en la interface
   * web.
   * @param {string} metricName Nombre de la metrica.
   * @param {string} metricDescription Una breve descripcion de la metrica.
   * @param {JSON} metricFunction Formula que define la metrica    
   * @param {Function} callback Funcion que se llamara luego de que se envie la
   *     metrica al servidor la misma podra ser usada para mostrar en la UI la respuesta del servidor.
   */
  function storeMetric(metricName, metricDescription, metricFunction, callback){
      //TODO hacer un md5 a metricName para obtener metricId
      var tosend = "{\"key\": \"" + metricName + "\"," +
              "\"nombre\": \"" + metricName + "\"," +
              "\"descripcion\": \"" + metricDescription + "\"," +
              "\"procedencia\": \"" + "tesys" + "\"," +
               metricFunction + "}";  
      $.ajax({
          url: location+'rest/controller/newmetric',
          type: 'POST',
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          success: function (data) {
            callback(data);
          },
          data: tosend
        });          
  }


  return {    
    'getAnalysis': getAnalysis,
    'getMetrics': getMetrics,
    'getSkills': getSkills,
    'score': score,
    'joinMetrics': joinMetrics,
    'storeAnalysis': storeAnalysis,
    'storeMetric': storeMetric,
    getPredictions: getPredictions
  };
});