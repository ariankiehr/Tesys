package org.tesys.core.estructures.metricvalue;

import org.tesys.core.estructures.Issue;

public class Suma extends CompositeValue {

    public Suma(IValue izq, IValue der) {
	super(izq, der);
    }

    @Override
    public String toString() {
	return "{\"Suma\":[" + izq.toString() + "," + der.toString() + "]}";
    }

    @Override
    public Double evaluate(Issue issue) {
    	Double i = izq.evaluate(issue);
    	Double d = der.evaluate(issue);
    	
    	if( i==null || d == null ) {
    		return null;
    	}
    	
    	return (i + d);
    }

}
