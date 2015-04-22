define(
  [ 'jquery', 
    'underscore', 
    'backbone',
    'extractor',
    'tesys',
    'amcharts.serial',
    'bar',
    'backbone-relational',
    'bootstrap'
  ], 
  function($, _, 
    Backbone, 
    extractor, 
    tesys,
    AmCharts,
    bar
  ) {
  
  // Arreglo de metrics keys 
  var metricsToPlot = ['progress', 'quacode', 'estimated', 'prec'];
  
  // Aqui se crea un AmChart en el elemento del DOM con id metrics.
  var chart = AmCharts.makeChart("metricChart", {    
      "type": "serial",
      "categoryField": "skill",
      "gridAboveGraphs": true,
      "valueAxes": [{
          "gridColor":"#FFFFFF",
          "gridAlpha": 0.2,
          "dashLength": 0,
          "tickPosition":"start",
          "tickLength":20,
          "axisTitleOffset": 20,
          "min": 0,
          "max": 1,
          "minMaxMultiplier": 1,
          "axisAlpha": 0.15 //hace mas clara u oscura la linea de los ejes
      }]   
  });

  var metricsPlotHandler = new bar(chart, metricsToPlot) ;

  


  var IssueView = Backbone.View.extend({
    tagName: 'a',

    //constants definitions 
    UNSELECTED_COLOR: "white", 
    SELECTED_COLOR: "darksalmon", 
    //end constants definitions
    
    events: {
      'click': 'select'
    },
    initialize: function(){//metricsPlotHandler, skillsPlotHandler){
      _.bindAll(this, 'render', 'select', 'plot'); 
   //   this.metricsPlotHandler = metricsPlotHandler; 
   //   this.skillsPlotHandler = skillsPlotHandler;
      this.isSelected = false;
      this.render();
    },
    render: function(){
      var issueId = this.model.get('issueId');

      //Al renderizar deberia limpiar el elemento viejo, 
      //ya que podria quedar basura en los atributos
      this.el.id = issueId; 
      this.el.setAttribute('class', 'list-group-item');
      this.el.text = "" ;

      if (this.model.get('metrics').ncloc) {
        //Si el Issue tiene codigo (suponesmos que hay codigo si existe la metrica 'nlocs')
        //Inserto in icono distintivo al issue
        var codeIcon = document.createElement("i");
        codeIcon.setAttribute('class', 'glyphicon glyphicon glyphicon-bookmark');
        this.el.appendChild(codeIcon);
      }

      //Debo insertar el texto, luego del icono del issue (si es que este fue creado)
      this.el.appendChild(document.createTextNode(issueId)) ;
      
      return this; // for chainable calls, like .render().el
    },
    select: function() { 
      this.isSelected = !this.isSelected;
      if(this.isSelected) {
        this.el.style.backgroundColor = this.SELECTED_COLOR ;
        this.plot(); 
      } else {
        this.el.style.backgroundColor = this.UNSELECTED_COLOR ;
        //this.unplot();
      }
      
    },

    plot: function(){
      var tag = this.model.get('user') + "::" + this.model.get('issueId') ;
      console.log("ploting "+ tag);

      if (!_.isEmpty(this.model.get('metrics'))){
        console.log("ploting metrics") ;
        // console.log(JSON.stringify(this.model.get('metrics')));
        // this.metricsPlotHandler.plot(tag, this.mode.get('metrics'));
         metricsPlotHandler.addGraph(tag, this.model.get('metrics')) ;
        
      }

      if (!_.isEmpty(this.model.get('skills'))){
        var skills = {} ;
        _(this.model.get('skills')).each(function(skill){

          // convert skills to simple array
          skills[skill.skillName] = skill.skillWeight;
        });

        // this.skillPlotHandler.plot(tag, skills);
        console.log("ploting skills") ;
        // console.log(JSON.stringify(skills));
      }
      
      
    },

  });

  var DeveloperView = Backbone.View.extend({ 

    //constants definitions 
    DECORATION_HAS_ISSUES: "none", 
    DECORATION_HASNOT_ISSUES: "line-through",
    //end constants definitions
    
    events: {
      'click': 'select'
    } ,
    initialize: function(){
      _.bindAll(this, 'render', 'listIssues', 'select'); 
    },
    render: function(){ 
      var self = this ;
      // Creating Developer name container
      var devNameContainer = document.createElement("a");
      devNameContainer.text = this.model.get('displayName');
      devNameContainer.setAttribute('class', 'list-group-item list-group-item-success');
      devNameContainer.setAttribute('data-parent', '#MainMenu');
      devNameContainer.setAttribute('data-toggle', 'collapse');
      devNameContainer.setAttribute('href','#'+this.model.get('name'));

      // If developer has not issues --> line-throught on devNameContainer.text
      if (_.isEmpty(this.model.get('issues').models)) {
        devNameContainer.style.textDecoration = this.DECORATION_HASNOT_ISSUES;
      } else {
        devNameContainer.style.textDecoration = this.DECORATION_HAS_ISSUES;
      }

      this.el.appendChild(devNameContainer);

      self.listIssues();
      return this; // for chainable calls, like .render().el
    },
    listIssues: function(){ 

      //devIssuesContainer es el panel desplegable (collapse) donde se listaran los issues
      var devIssuesContainer = document.createElement("div");
      devIssuesContainer.setAttribute('class', 'panel-collapse collapse');
      devIssuesContainer.id = this.model.get('name') ;

      _(this.model.get('issues').models).each(function(issue){
        //recorro todos los issues, por cada issue del modelo le asocio una vista.
        //la cual la agrego a devIssuesContainer
        var issueView = new IssueView({ model: issue });
        devIssuesContainer.appendChild(issueView.render().el);
      });

      this.el.appendChild(devIssuesContainer);
      return this;
    },
    select: function() {
      console.log("clicked developer: " + this.model.get('name'));
    }
  });

  var DeveloperCollectionView = Backbone.View.extend({
    el: $('#developers-issues'), // el attaches to existing element
    initialize: function(developerList){

      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render', 'appendItem');
      this.collection = developerList;
      this.render();
    },
    render: function(){
      var self = this;
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    appendItem: function(item){
      var itemView = new DeveloperView({model: item});
      this.$el.append(itemView.render().el);
    }
  });

  var MetricView = Backbone.View.extend({
    //constants definition
    UNSELECTED_COLOR: "white", 
    SELECTED_COLOR: "darksalmon",
    //end const definition
    tagName: 'li', 
    events: {
      'click': 'select'
    },
    initialize: function(){
      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render' ,'select');
      this.isSelected = false;
      this.render();
    },
    render: function() {
      this.el.id = this.model.get('key') ;
      this.el.innerHTML = '' ;
      var textContainer = document.createElement('a');
      textContainer.text = this.model.get('nombre');
      this.el.appendChild(textContainer) ;
      return this ;
    },
    select: function() {
      this.isSelected = !this.isSelected;
      if(this.isSelected) {
        this.el.style.backgroundColor = this.SELECTED_COLOR ; 
      } else {
        this.el.style.backgroundColor = this.UNSELECTED_COLOR ;
      }
    }

  });

  var MetricCollectionView = Backbone.View.extend({
    el: $('#metrics'), // el attaches to existing element
    initialize: function(metricCollection){
      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render', 'appendItem');
      this.collection = metricCollection;
      this.render();
    },
    render: function(){
      var self = this;
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      });
      return this;
    },
    appendItem: function(item){
      var metricView = new MetricView({model: item});
      this.$el.append(metricView.render().el);
    }

  });

  return {
    IssueView: IssueView,
    DeveloperView: DeveloperView,
    DeveloperCollectionView: DeveloperCollectionView,
    MetricCollectionView: MetricCollectionView,
    MetricView: MetricView
  };
});
