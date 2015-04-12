package org.tesys.core.estructures.metricvalue;

import org.tesys.core.estructures.Issue;

public class Constant implements IValue {
    private Double value;

    public Constant(String value) {
	super();
	this.value = Double.valueOf(value);
    }

    public Double getValue() {
	return value;
    }

    public void setValue(Double value) {
	this.value = value;
    }

    @Override
    public String toString() {
	return "{\"Constant\":\"" + value + "\"}";
    }

    @Override
    public Double evaluate(Issue issue) {
	return this.getValue();
    }

}
