package org.tesys.recomendations;

import java.util.LinkedList;
import java.util.List;

import org.tesys.core.db.ElasticsearchDao;
import org.tesys.core.estructures.Developer;
import org.tesys.core.estructures.Issue;
import org.tesys.core.project.tracking.IssuePOJO;


public class IssuesaAlike {
	
	public List<Developer> getSimilarIssuesTo(IssuePOJO ip, IssueSimilarity issi) {
		List<Issue> lissue = new LinkedList<Issue>();
		List<Developer> ldeveloper = new LinkedList<Developer>();
		
		//Traigo todos los issues ya analizados en la db
		ElasticsearchDao<Issue> daoi = new ElasticsearchDao<Issue>(Issue.class,
				ElasticsearchDao.DEFAULT_RESOURCE_ISSUE_METRIC);
		
		List<Issue> idb = daoi.readAll();
		
		//Se guardan todos los issues relacionados
		for (Issue issue : idb) {
			if( ip.getIssuetype().equals(issue.getIssueType()) && issi.areSimilar(ip, issue) ) {
				lissue.add(issue);
			}
		}
		
		//ahora se clasifican en developers
		boolean exist;
		for (Issue issue : lissue) {
			exist=false;
			for (Developer dev : ldeveloper) {
				if( dev.getName().equals(issue.getUser()) ) {
					dev.addIssue(issue);
					exist=true;
				}
			}
			if(exist==false) {
				Developer d = new Developer();
				d.setName(issue.getUser());
				d.addIssue(issue);
				ldeveloper.add(d);
			}
		}

		return ldeveloper;
	}
	
	

}
