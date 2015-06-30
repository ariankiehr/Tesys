package org.tesys.core.db;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.tesys.core.estructures.Developer;


public class DisplayNameQuery implements GenericQuery<String>  {
	
    private static final Logger LOG = Logger.getLogger(ValidDeveloperQuery.class.getName());
    private ElasticsearchDao<Developer> dao;
    private String id;

    public DisplayNameQuery(String id) {
    	AnalysisVersionsQuery avq = new AnalysisVersionsQuery();
		this.dao = new ElasticsearchDao<Developer>(Developer.class,
				ElasticsearchDao.DEFAULT_RESOURCE_DEVELOPERS + avq.execute().get(0));
		this.id = id;
    }
	
	@Override
	public String execute() {
		String query = "{ \"query\": { \"bool\": { \"must\":  [" +
        "{\"match\": {\"name\": \""+ id +"\"  }} ] } } }";
		try {
		    return dao.search(query).get(0).getDisplayName();
		} catch (Exception e) {
		    LOG.log(Level.INFO, e.getMessage());
		}
		return null;
	}

}
