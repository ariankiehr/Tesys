package org.tesys.recomendations;

import java.util.Arrays;
import java.util.List;

import org.tesys.core.estructures.Issue;


public class IssueSimilarity {
	
	public boolean areSimilar(Issue ip, Issue i) {
		List<String> labelsip = Arrays.asList(ip.getLabels());
		List<String> labelsi = Arrays.asList(i.getLabels());
		
		
		//if( ip.getIssuetype().equals(i.getIssueType()) ) {
			for (String l : labelsi) {
				if(labelsip.contains(l)){
					return true;
				}
			}
			
		//}
		
		
		return false;
	}

}
