define(["jquery"], function($) {

    // Register listeners

    var server = "http://localhost:9200/"

    function removeDuplications(arr) {
        var uniqueVals = [];
        $.each(arr, function(i, el){
            if($.inArray(el, uniqueVals) === -1) uniqueVals.push(el);
        });
        return uniqueVals ;
    }

    /*
    Get all Metric keys from ES
    */
    function getMetrics(htmlOptionsId) {
        var query =
            { 
                "query" : { 
                    "match_all" : {} 
                },
                "fields": []
            } ;

        $.ajax({
            type: 'POST',
            url: server + "analyzer/metric/_search?size=200",
            dataType: "json", // data type of response
            data: JSON.stringify( query, 2, null ),
            success: function (data) {

                var metricKeys = [];
                for (i = 0; i < data["hits"]["hits"].length; i++) {
                    metricKeys.push(data["hits"]["hits"][i]["_id"]); 
                } 
                displayOptions(metricKeys, htmlOptionsId) ;
            }
        });
    }

    /*
    Get all Skill keys from ES
    */
    function getSkills(htmlOptionsId) {

        $.ajax({
            type: 'GET',
            url: server+"analyzer/skills/_search?size=200",
            dataType: "json", 
         
            success: function (data) {

                var skills = [] ;
                for (i = 0; i < data["hits"]["hits"].length ; i++) {
                    skills.push(data["hits"]["hits"][i]["_source"]["skillName"]) ;
                }

                displayOptions(removeDuplications(skills), htmlOptionsId);

            }
        });
    }

    function getIssuesByUser(user, htmlOptionsId) {
        var query = 
            { "query":  
              { "bool":  
                { "must": [ { "match": { "name": user }} ] } 
              } 
            };

        $.ajax({
            type: 'POST',
            url: server+"analysis/_search",
            dataType: "json", 
            data: JSON.stringify( query, 2, null ),
         
            success: function (data) {
                var issues = [] ;
                for (i = 0; i < data["hits"]["hits"][0]["_source"]["issues"].length ; i++) {
                    if ( data["hits"]["hits"][0]["_source"]["issues"][i]["metrics"]["lines"] ) {
                        issues.push(data["hits"]["hits"][0]["_source"]["issues"][i]["issueId"]);
                    }
                }
                $(htmlOptionsId).empty() ;
                displayOptions(removeDuplications(issues), htmlOptionsId);

            }
        });
    }

    function getUsers(htmlOptionsId) {
        $.ajax({
            type: 'GET',
            url: server + "scm/user/_search?size=200",
            dataType: "json", // data type of response
            success: function (data) {

                var users = [];
                for (i = 0; i < data["hits"]["hits"].length; i++) {
                    users.push(data["hits"]["hits"][i]["_source"]["scmUser"]); 
                } 
                displayOptions(removeDuplications(users), htmlOptionsId) ;
            }
        });
    }

    function displayOptions(result, htmlOptionsId) {
        $.each(result, function() {
            $(htmlOptionsId).append( new Option(this,this) );
        });
    }

    function plotIssueMetrics(issueKey, user, chart) {
     
        var key = issueKey.split("-"); 

        var query =         
            { "query": 
                  { "bool":
                    { "must": [
                        { "match": { "issues.issueId": key[0] }},
                        { "match": { "issues.issueId": key[1] }},
                        { "match": { "user": user }}                    
                        ]
                    }
                  }
            } ;

        $.ajax({
            type: 'POST',
            url: server+"analysis/_search",
            dataType: "json", // data type of response
            data: JSON.stringify( query, 2, null ),
            success: function (data) {
                index = 0 ; //TODO deberia ser el ultimo.
                issues = data["hits"]["hits"][index]["_source"]["issues"] ;

                var metrics ;
                for (i = 0; i < issues.length; i++) {
                    if (issues[i]["issueId"] == issueKey) {
                        metrics = issues[i]["metrics"] ;
                    } 
                } 
                var tag = user + "::" + issueKey ;
                chart.addGraph( tag, metrics) ;//TODO sacar esto
            }
        });
    }

    function plotIssueSkills(issueKey, user, chart) {
        var key = issueKey.split("-"); 
        var query =         
            { "query": 
                  { "bool":
                    { "must": [
                        { "match": { "issues.issueId": key[0] }},
                        { "match": { "issues.issueId": key[1] }}
                        ]
                    }
                  }
            } ;

        $.ajax({
            type: 'POST',
            url: server+"analysis/_search",
            dataType: "json", // data type of response
            data: JSON.stringify( query, 2, null ),
            success: function (data) {
                index = 0 ; //TODO deberia ser el ultimo.
                issues = data["hits"]["hits"][index]["_source"]["issues"] ;
                var skills = {} ;
                for (i = 0; i < issues.length; i++) {
                    if (issues[i]["issueId"] == issueKey) {
                        if (issues[i]["skills"] != null) {

                            for( j=0; j < issues[i]["skills"].length; j++ ) {
                                skills[issues[i]["skills"][j]["skillName"]] =  issues[i]["skills"][j]["skillWeight"] ;
                            }

                        }
                    } 
                } 
                var tag = user + "::" + issueKey ;
                chart.addGraph( tag, skills) ;//TODO sacar esto
            }
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





