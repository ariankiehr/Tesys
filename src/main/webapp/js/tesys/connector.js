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
        url: location+'rest/controller/metrics',
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

  return {    
    'getAnalysis': getAnalysis,
    'getMetrics': getMetrics,
    'getSkills': getSkills
  };
});