define(["jquery"], function($) {
  function getAnalysis(callback) {
    $.ajax({
      type: 'GET',
      url: "file:////home/leandro/Tesis/workspace/tesys/src/main/webapp/developers-issues.json",
      dataType: 'json', // data type of response
      success: function(data) {
        callback(data) ;
      }
    });
  }

  function getMetrics(callback) {
    $.ajax({
        type: 'GET',
        url: "file:////home/leandro/Tesis/workspace/tesys/src/main/webapp/metrics.json",
        dataType: "json", // data type of response
        success: function (data) {
          callback(data) ;
        }
    });
  }

  function getSkills(callback) {
    $.ajax({
      type: 'GET',
      url: "file:////home/leandro/Tesis/workspace/tesys/src/main/webapp/skills.json",
      dataType: "json", 
      success: function (data) {
        callback(data);
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


  return {    
    'getAnalysis': getAnalysis,
    'getMetrics': getMetrics,
    'getSkills': getSkills,
    'score': score,
    'joinMetrics': joinMetrics,
    'storeAnalysis': storeAnalysis
  };
});