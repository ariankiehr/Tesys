define(
  [ 'jquery',
    'underscore',
    'backbone',
    'extractor', 
    'tesys',
    'backbone-relational',
    'bootstrap'
  ], 
  function($, _, 
    Backbone, 
    extractor, 
    tesys
  ) {

  var Issue = Backbone.RelationalModel.extend({
    idAttribute: 'issueId'
  });

  var IssueCollection = Backbone.Collection.extend({
    model: Issue
  });

  var Developer = Backbone.RelationalModel.extend({
    idAttribute: 'name',
    relations: [{
      type: Backbone.HasMany, 
      key: 'issues',
      relatedModel: Issue,
      collectionType: IssueCollection,
      reverseRelation: {
        key: 'name',
        includeInJSON: 'id'
        // 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
      }
    }] 
  });

  var DeveloperCollection = Backbone.Collection.extend({
    model: Developer
  });


  return {
    Issue: Issue,
    IssueCollection: IssueCollection,
    Developer: Developer,
    DeveloperCollection: DeveloperCollection
  };

});