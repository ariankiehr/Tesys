package org.tesys.core.estructures.metricvalue;

import org.tesys.core.estructures.Issue;

public class Division extends CompositeValue {

    public Division(IValue izq, IValue der) {
	super(izq, der);
    }

    @Override
    public String toString() {
	return "{\"Division\":[" + izq.toString() + "," + der.toString() + "]}";
    }

    @Override
    public Double evaluate(Issue issue) {
    	
    	Double i = izq.evaluate(issue);
    	Double d = der.evaluate(issue);
    	
    	if( i==null || d == null ) {
    		return null;
    	}
    	
    	if( d == 0.0 ){
    		d = d + 0.1;
    	}
    	
    	return (i / d);
    }

}
