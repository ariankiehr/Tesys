package org.tesys.core.estructures.metricvalue;

import org.tesys.core.estructures.Issue;

public class SimpleValue implements IValue {

    private String key;

    public SimpleValue(String key) {
	super();
	this.key = key;
    }

    public String getKey() {
	return key;
    }

    public void setKey(String key) {
	this.key = key;
    }

    @Override
    public String toString() {
	return "{\"SimpleValue\":\"" + key + "\"}";
    }

    @Override
    public Double evaluate(Issue issue) {
    	Double i = issue.getMetrics().get(key);
    	
    	if( i == null ){
    		return null;
    	}
    	
    	return issue.getMetrics().get(key);
    }

}
