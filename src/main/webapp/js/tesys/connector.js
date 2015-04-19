define(["jquery"], function($) {
  function getUsers(callback) {
    $.ajax({
      type: 'GET',
      url: location+'rest/controller/developers/0',
      dataType: 'json', // data type of response
      success: function(data) {
        callback(data) ;
      }
    });
  }

  return {    
    'getUsers': getUsers,
  };
});