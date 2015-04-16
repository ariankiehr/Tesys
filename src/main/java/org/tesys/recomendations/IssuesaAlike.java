package org.tesys.recomendations;

import java.util.LinkedList;
import java.util.List;

import org.tesys.core.db.ElasticsearchDao;
import org.tesys.core.estructures.Developer;
import org.tesys.core.estructures.Issue;
import org.tesys.core.project.tracking.IssuePOJO;


public class IssuesaAlike {
	
	public List<Developer> getSimilarIssuesTo(IssuePOJO ip, IssueSimilarity issi) {

		ElasticsearchDao<Developer> daoi = new ElasticsearchDao<Developer>(Developer.class,
				ElasticsearchDao.DEFAULT_RESOURCE_DEVELOPERS);
		
		
		List<Developer> ld  = daoi.readAll();
		List<Developer> ldeveloper = new LinkedList<Developer>(ld);
		
		for (Developer d : ld) {
			List<Issue> li = d.getIssues();
			List<Issue> lissue = new LinkedList<Issue>(li);
			for (Issue i : li) {
				if(!issi.areSimilar(ip, i)) {
					lissue.remove(i);
				}
			}
			d.setIssues(lissue);
			if( d.getIssues().isEmpty() ){
				ldeveloper.remove(d);
			}
		}

		return ldeveloper;
	}
	
	

}
