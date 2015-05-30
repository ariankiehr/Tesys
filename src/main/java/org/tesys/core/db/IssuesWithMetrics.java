package org.tesys.core.db;


import java.util.List;

import org.tesys.core.estructures.Issue;



public class IssuesWithMetrics implements GenericQuery<List<Issue>>  {

	private ElasticsearchDao<Issue> dao;
	
	public IssuesWithMetrics(int sprint) {
		
		if(sprint==0) {
			this.dao = new ElasticsearchDao<Issue>(Issue.class,
					ElasticsearchDao.DEFAULT_RESOURCE_ISSUE_METRIC);
		} else if(sprint==1) {
			this.dao = new ElasticsearchDao<Issue>(Issue.class,
					ElasticsearchDao.DEFAULT_RESOURCE_SPRINT1);
		} else {
			this.dao = new ElasticsearchDao<Issue>(Issue.class,
					ElasticsearchDao.DEFAULT_RESOURCE_SPRINT2);
		}

	}
	
	
	@Override
	public List<Issue> execute() {
		//TODO el 500 habria que sacarlo con un getSize del elasticsearcdAO
		String query = "{\"size\" : 500,\"query\" : {\"constant_score\" : {\"filter\" : {\"exists\" : {\"field\" : \"lines\"}} } } }";
		try {
		    return dao.search(query);
		} catch (Exception e) {
			System.out.println("error");
		}
		return null;
	}
	
	

}
