define(["jquery", "extractor", "parser"], function($, extractor) {

  $('#btnAddMetric').click(function() {
    // Appends metric into complex metric function
    $('#functionEdit').val($('#functionEdit').val() + " " + $('#metrics').find('option:selected').val()) ;
  });


  $('#send').click(function () {
    try {
      var result = parser.parse($("input[name=fo]").val());
      
      var tosend = "{\"key\": \"" + $("input[name=id]").val() + "\"," +
              "\"nombre\": \"" + $("input[name=no]").val() + "\"," +
              "\"descripcion\": \"" + $("input[name=de]").val() + "\"," +
              "\"procedencia\": \"" + $("input[name=po]").val() + "\"," +
               result + "}";  

      $.ajax({
          url: 'http://localhost:8080/tesys/rest/controller/newmetric',
          type: 'post',
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          success: function (data) {
            markers = JSON.stringify(data);
            $("#span").html(markers);

          },
          data: tosend
        });          
    } catch (e) {
      $("#span").html(String(e));
    }
  });

});
