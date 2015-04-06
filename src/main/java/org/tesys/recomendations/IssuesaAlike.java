package org.tesys.recomendations;

import java.util.LinkedList;
import java.util.List;

import org.tesys.core.db.ElasticsearchDao;
import org.tesys.core.estructures.Issue;
import org.tesys.core.project.tracking.IssuePOJO;


public class IssuesaAlike {
	
	public List<Issue> getSimilarIssuesTo(IssuePOJO ip, IssueSimilarity issi) {
		List<Issue> lissue = new LinkedList<Issue>();
		
		//Traigo todos los issues ya analizados en la db
		ElasticsearchDao<Issue> daoi = new ElasticsearchDao<Issue>(Issue.class,
				ElasticsearchDao.DEFAULT_RESOURCE_ISSUE_METRIC);
		
		List<Issue> idb = daoi.readAll();
		
		for (Issue issue : idb) {
			
			if( ip.getIssuetype().equals(issue.getIssueType()) && issi.areSimilar(ip, issue) ) {
				lissue.add(issue);
			}
			
		}

		return lissue;
	}
	
	

}
