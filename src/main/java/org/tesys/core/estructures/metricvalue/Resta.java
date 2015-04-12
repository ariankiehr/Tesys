package org.tesys.core.estructures.metricvalue;

import org.tesys.core.estructures.Issue;

public class Resta extends CompositeValue {

    public Resta(IValue izq, IValue der) {
	super(izq, der);
    }

    @Override
    public String toString() {
	return "{\"Resta\":[" + izq.toString() + "," + der.toString() + "]}";
    }

    @Override
    public Double evaluate(Issue issue) {
    	Double i = izq.evaluate(issue);
    	Double d = der.evaluate(issue);
    	
    	if( i==null || d == null ) {
    		return null;
    	}
    	
	return (i - d);
    }

}
