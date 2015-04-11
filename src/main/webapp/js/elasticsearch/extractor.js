define(["jquery"], function($) {

    // Register listeners
    
    function removeDuplications(arr) {
        var uniqueVals = [];
        $.each(arr, function(i, el){
            if($.inArray(el, uniqueVals) === -1) uniqueVals.push(el);
        });
        return uniqueVals ;
    }

    /**
    * Get all Metric keys from ES
    */
    function getMetrics(htmlOptionsId) {
        $.ajax({
            type: 'GET',
            url: location+'rest/controller/metrics',
            dataType: "json", // data type of response
            success: function (data) {

                var metricKeys = [];
                for (var i = 0; i < data.length; i++) {
                    metricKeys.push(data[i].key); 
                } 
                displayOptions(metricKeys, htmlOptionsId) ;
            }
        });
    }
    
    /**
    * Get all Skill keys from ES
    */
    function getSkills(htmlOptionsId) {
        $.ajax({
            type: 'GET',
            url: location+'rest/controller/skills',
            dataType: "json", 
            success: function (data) {

                var skills = [] ;
                for (var i = 0; i < data.length ; i++) {
                    skills.push(data[i].skillName) ;
                }
                $(htmlOptionsId).empty() ;
                displayOptions(removeDuplications(skills), htmlOptionsId);

            }
        });
    }
    
    /**
     * Dado un User devuelve todos los issues los cuales se ha desarrollado codigo.
     * Se supone que un User desarrollo codigo si existe la metrica "lines".
     */
    function getIssuesByUser(user, htmlOptionsId) {
        $.ajax({
            type: 'GET',
            url: location+'rest/controller/issues/'+user,
            dataType: "json", 
            success: function (data) {
                var issues = [] ;
                for (var i=0; i<data.length; i++) {
                	if (data[i].metrics.lines) {
                        issues.push(data[i].issueId);   
                	}
                } 
                $(htmlOptionsId).empty() ;
                displayOptions(removeDuplications(issues), htmlOptionsId);

            }
        });
    }

    /**
     * Inserta en un Select HTML todos los desarrolladores.
     */
    function getUsers(htmlOptionsId) {
        $.ajax({
            type: 'GET',
            url: location+'rest/controller/developers/0',
            dataType: "json", // data type of response
            success: function (data) {
                var users = [];
                for (var i = 0; i < data.length; i++) {
                    users.push(data[i].name); 
                } 
                $(htmlOptionsId).empty() ;
                displayOptions(removeDuplications(users), htmlOptionsId) ;
            }
        });
    }


    /**
     * Dado un issue y un user, realiza el grafico de las metricas.
     * Las metricas graficadas seran un subconjunto del total de metricas.
     */
    function plotIssueMetrics(issueKey, user, chart) {
        $.ajax({
            type: 'GET',
            url: location+'rest/controller/issue/'+user+'/'+issueKey,
            dataType: "json", // data type of response
            success: function (data) {
                var metrics = data.metrics ;    
                var tag = user + "::" + issueKey ;
                chart.addGraph( tag, metrics) ;
            }
        });
    }

    /**
     * Dado un issue y un user, realiza el grafico de los skills.
     * Los skills graficados seran un subconjunto del total de skills.
     */
    function plotIssueSkills(issueKey, user, chart) {
        $.ajax({
            type: 'GET',
            url: location+'rest/controller/issue/'+user+'/'+issueKey,
            dataType: "json", // data type of response
            success: function (data) {
                var skills = {} ;
                for (var i = 0; i<data.skills.length; i++) {
                    skills[data.skills[i].skillName] = data.skills[i].skillWeight;
                } 
                var tag = user + "::" + issueKey ;
                chart.addGraph(tag, skills) ;
            }
        });
    }


    /**
     * Dado un Select de HTML inserta los elementos del arreglo result como
     * elementos Options dentro del Select
     */
    function displayOptions(result, htmlOptionsId) {
        $.each(result, function() {
            $(htmlOptionsId).append( new Option(this,this) );
        });
    }
    
    return { 
        'displayOptions': displayOptions, 
        'getMetrics': getMetrics,
        'getUsers': getUsers, 
        'getIssuesByUser': getIssuesByUser,
        'getSkills' : getSkills,
        'removeDuplications': removeDuplications, 
        'plotIssueMetrics': plotIssueMetrics, 
        'plotIssueSkills': plotIssueSkills
    };
});





