define(
  [ 'jquery', 
    'underscore', 
    'backbone',
    'tesys',
    'bar',
    'radar',
    'backbone-relational',
    'bootstrap'
  ], 
  function($, _, 
    Backbone, 
    tesys,
    bar,
    radar
  ) {

  // *** SKILLS FOR RECOMENDATIONS ***
  var SkillView = Backbone.View.extend({
    //constants definition
    UNSELECTED_COLOR: "white", 
    SELECTED_COLOR: "darksalmon",
    //end const definition
    tagName: 'li', 
    events: {
      'click': 'select'
    },
    initialize: function(options){
      this.options = options || {};

      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render' ,'select');
      this.isSelected = false;
      this.render();
    },
    render: function() {
      this.el.id = this.model.get('key') ;
      this.el.innerHTML = '' ;
      var textContainer = document.createElement('a');
      textContainer.textContent = this.model.get('nombre');
      this.el.appendChild(textContainer) ;
      return this ;
    },
    select: function() {
      this.isSelected = !this.isSelected;
      if(this.isSelected) {
        this.el.style.backgroundColor = this.SELECTED_COLOR ;
        this.options.selectedSkills.array.push(this.model.get('key'));
      } else {
        this.el.style.backgroundColor = this.UNSELECTED_COLOR ;
        this.options.selectedSkills.array = _.without(
          this.options.selectedSkills.array, 
          this.model.get('key')
        );
      }
    }
  });

  var SkillCollectionView = Backbone.View.extend({
  //  el: $('#metrics'), // el attaches to existing element
    initialize: function(options){
      this.options = options || {};
      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render', 'appendItem');

      //Event subscription
      this.collection.on({'reset': this.render});
      
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
      var metricView = new SkillView(
        { model: item, 
          selectedSkills: this.options.selectedSkills,
        }
      );
      this.$el.append(metricView.render().el);
    }
  });


//** Predictions View
  // *** DEVELOPERS ***

  var issuesViewsToPlot = { array:[] } ; 

  var IssuePredictionView = Backbone.View.extend({
    tagName: 'a',

    //constants definitions 
    UNSELECTED_COLOR: "white", 
    SELECTED_COLOR: "darksalmon", 
    //end constants definitions
    
    events: {
      'click': 'select'
    },
    initialize: function(options){
      this.options = options || {};
      _.bindAll(this, 'render', 'select', 'plot', 'tag', 'adapt'); 
      this.isSelected = false;
      this.render();
    },
    render: function(){
      var issueId = this.model.get('issueId');

      //Al renderizar deberia limpiar el elemento viejo, 
      //ya que podria quedar basura en los atributos
      this.el.id = "pred"+issueId; 
      this.el.setAttribute('class', 'list-group-item');
      this.el.textContent = "" ;

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

    tag: function(){
      return this.model.get('user') + "::" + this.model.get('issueId') ;
    },

    /**
     * [select Este metodo se ocupa de cambiar de estado a un issue 
     * (seleccionado/no-seleccionado) de manera tal de que se lleve un registro
     * de los issues que estan seleccionados. 
     *   Este evento se dispara cuando se hace click sobre un issue.]
     */
    select: function() { 
      this.isSelected = !this.isSelected;
      if(this.isSelected) {
        this.el.style.backgroundColor = this.SELECTED_COLOR ;
        issuesViewsToPlot.array.push(this);
        this.plot(); 
      } else {
        issuesViewsToPlot.array = _.without(issuesViewsToPlot.array, this);
        this.el.style.backgroundColor = this.UNSELECTED_COLOR ;
        var self = this;
        _(this.options.plotter).each(function(p){
          p.removeGraph(self.tag());
        });
      }
    },

    /**
     * [adapt convierte un atributo del modelo en un arreglo, para poder ser
     * graficado en un formato estandar]
     * @param  {[type]} attributeToAdapt [el atributo puede ser 'metrics' o 
     * 'skills']
     * @return {[JSON of metricKey:metricValue]}                  
     * [es el formato estandar con el cual se le pasaran los valores a graficar
     * al plotter]
     */
    adapt: function(attributeToAdapt){
      if (attributeToAdapt == 'metrics'){
        return this.model.get('metrics');
      } else if (attributeToAdapt == 'skills') {
        var skills = {} ;

        // convert skills to simple array
        _(this.model.get('skills')).each(function(skill){
          skills[skill.skillName] = skill.skillWeight;
        });
        return skills;
      }

    },

    /**
     * [plot Dibuja el gráfico del issue dentro del conjunto de plotters]
     */
    plot: function(){
      //Ploting metrics
      var self = this;
      $(this.options.attrToPlot).each(function(i, attr){
        if (self.options.plotter[i]){
          var toPlot = self.adapt(attr) ;
          if (!_.isEmpty(toPlot)){
            self.options.plotter[i].addGraph(self.tag(), toPlot);
          }
        }
      });
    },

    plotSingle: function(plotter, attr) {
      if (plotter) {
        var toPlot = this.adapt(attr) ;
        if (!_.isEmpty(toPlot)){
          plotter.addGraph(this.tag(), toPlot);
        }
      }
    } 
  });

  var DeveloperPredictionView = Backbone.View.extend({ 

    //constants definitions 
    DECORATION_HAS_ISSUES: "none", 
    DECORATION_HASNOT_ISSUES: "line-through",
    //end constants definitions
    
    events: {
      'click': 'select'
    } ,
    initialize: function(options){
      this.options = options || {};
      _.bindAll(this, 'render', 'listIssues', 'select'); 
    },
    render: function(){ 
      var self = this ;
      // Creating Developer name container
      var devNameContainer = document.createElement("a");
      devNameContainer.textContent = this.model.get('displayName');
      devNameContainer.setAttribute('class', 'list-group-item list-group-item-success');
      devNameContainer.setAttribute('data-parent', '#MainMenu2');
      devNameContainer.setAttribute('data-toggle', 'collapse');
      devNameContainer.setAttribute('href','#pred'+this.model.get('name'));

      // If developer has not issues --> line-throught on devNameContainer.textContent
      if (_.isEmpty(this.model.get('issues').models)) {
        devNameContainer.style.textDecoration = this.DECORATION_HASNOT_ISSUES;
      } else {
        devNameContainer.style.textDecoration = this.DECORATION_HAS_ISSUES;
        if(this.model.get('displayName')) {
            this.el.appendChild(devNameContainer);
            self.listIssues();
        }
      }      
      return this; // for chainable calls, like .render().el
    },
    listIssues: function(){ 

      //devIssuesContainer es el panel desplegable (collapse) donde se listaran los issues
      var devIssuesContainer = document.createElement("div");
      devIssuesContainer.setAttribute('class', 'panel-collapse collapse');
      devIssuesContainer.id = "pred"+this.model.get('name') ;
      var self = this;
      _(this.model.get('issues').models).each(function(issue){
        //recorro todos los issues, por cada issue del modelo le asocio una vista.
        //la cual la agrego a devIssuesContainer
        var issueView = new IssuePredictionView(
          { model: issue, 
            plotter: self.options.plotter,
            attrToPlot: self.options.attrToPlot
          }
        );
        devIssuesContainer.appendChild(issueView.render().el);
      });

      this.el.appendChild(devIssuesContainer);
      return this;
    },
    select: function() {
      //console.log("clicked developer: " + this.model.get('name'));
    }
  });

  var DeveloperPredictionCollectionView = Backbone.View.extend({
    initialize: function(options){
      this.options = options || {};

      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render', 'appendItem');

      this.collection.on({'reset': this.render});

      this.render();
    },
    render: function(){
      this.$el.empty();
      var self = this;
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    appendItem: function(item){
      var itemView = new DeveloperPredictionView(
        { model: item, 
          plotter: this.options.plotter,
          attrToPlot: this.options.attrToPlot
        }
      );
      this.$el.append(itemView.render().el);
    }
  });

  var MetricPredictionView = Backbone.View.extend({
    //constants definition
    UNSELECTED_COLOR: "white", 
    SELECTED_COLOR: "darksalmon",
    //end const definition
    tagName: 'li', 
    events: {
      'click': 'select'
    },
    initialize: function(options){
      this.options = options || {};

      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render' ,'select');
      this.isSelected = false;
      this.render();
    },
    render: function() {
      this.el.id = this.model.get('key') ;
      this.el.innerHTML = '' ;
      var textContainer = document.createElement('a');
      textContainer.textContent = this.model.get('nombre');
      this.el.appendChild(textContainer) ;
      return this ;
    },
    select: function() {
      this.isSelected = !this.isSelected;
      if(this.isSelected) {
        this.el.style.backgroundColor = this.SELECTED_COLOR ;
        this.options.metricsToPlot.array.push(this.model.get('key'));
      } else {
        this.el.style.backgroundColor = this.UNSELECTED_COLOR ;
        this.options.metricsToPlot.array = _.without(
          this.options.metricsToPlot.array, 
          this.model.get('key')
        );
      }

      if (issuesViewsToPlot.array.length>=0){
        console.log("plotting on ");
        console.log(this.options.plotter.amChartHTMLContainer);
        this.options.plotter.build(this.options.metricsToPlot.array);
        var self = this;
        _(issuesViewsToPlot.array).each(function(issueView){
          console.log(" plotting issue: " + issueView) ;
          issueView.plotSingle(self.options.plotter, self.options.type);
        });
      } 
    }
  });

  var MetricPredictionCollectionView = Backbone.View.extend({
    initialize: function(options){
      this.options = options || {};
      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render', 'appendItem');

      //Event subscription
      this.collection.on({'reset': this.render});
      
      this.render();
    },
    render: function(){
      this.$el.empty();
      var self = this;
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      });
      return this;
    },
    appendItem: function(item){
      var metricView = new MetricPredictionView(
        { model: item, 
          metricsToPlot: this.options.metricsToPlot,
          plotter: this.options.plotter,
          type: this.options.type
        }
      );
      this.$el.append(metricView.render().el);
    }
  });

  return {
    SkillCollectionView: SkillCollectionView,
    issuesViewsToPlot: issuesViewsToPlot,
    IssuePredictionView: IssuePredictionView,
    DeveloperPredictionView: DeveloperPredictionView,
    DeveloperPredictionCollectionView: DeveloperPredictionCollectionView,
    MetricPredictionView: MetricPredictionView,
    MetricPredictionCollectionView: MetricPredictionCollectionView
  };
});