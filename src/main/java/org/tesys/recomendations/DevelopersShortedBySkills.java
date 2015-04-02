package org.tesys.recomendations;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.tesys.core.analysis.skilltraceability.Skill;
import org.tesys.core.db.AnalysisVersionsQuery;
import org.tesys.core.db.ElasticsearchDao;
import org.tesys.core.estructures.Developer;
import org.tesys.core.estructures.Issue;

public class DevelopersShortedBySkills {
	
	List<String> lskills;
	
	public DevelopersShortedBySkills(List<String> lskills) {
		this.lskills = lskills;
	}
	
	
	public List<DeveloperWithOneAcumMetric> getDevelopersShortedBySkills() {
		List<DeveloperWithOneAcumMetric> developers = new LinkedList<DeveloperWithOneAcumMetric>();
		
		//Obtener los developers
		AnalysisVersionsQuery avq = new AnalysisVersionsQuery();
		
		List<Long> versiones = avq.execute();
		
		ElasticsearchDao<Developer> daod = new ElasticsearchDao<Developer>(Developer.class,
				ElasticsearchDao.DEFAULT_RESOURCE_DEVELOPERS
				+ versiones.get(versiones.size()-1));
		
		List<Developer> devs = daod.readAll();
		
		//Calcular
		
		for (Developer d : devs) {
			DeveloperWithOneAcumMetric dwm = new DeveloperWithOneAcumMetric(d.getName(), null);
			for (Issue i : d.getIssues()) {
				if(i.getSkills() != null) {
					
					for (Skill skill : i.getSkills()) {
						if( lskills.contains(skill.skillName) ) {
							if(dwm.getMetric()==null) {
								dwm.setMetric(skill.skillWeight.doubleValue());
							} else {
								dwm.setMetric( dwm.getMetric() + skill.skillWeight.doubleValue());
							}
						}
					}
				}
			}	
			
			developers.add(dwm);
		}
		
		
		Collections.sort(developers);
		
		return developers;
	}
	
}
