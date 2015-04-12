package org.tesys.core.estructures.metricvalue;

/**
 * Esta clase es de donde deben heredar las operaciones aritmeticas (o de otro indole)
 * binarias que se quieran realizar para poder llevar a cabo el calculo de una metrica
 *
 */

public abstract class CompositeValue implements IValue {
    
    /**
     * Dos ivalue que son los que se evaluaan en una expresion binaria de la forma
     * Ivalue + Ivalue
     */
    protected IValue izq, der;

    public CompositeValue(IValue izq, IValue der) {
	super();
	this.izq = izq;
	this.der = der;
    }

    public IValue getIzq() {
	return izq;
    }

    public void setIzq(IValue izq) {
	this.izq = izq;
    }

    public IValue getDer() {
	return der;
    }

    public void setDer(IValue der) {
	this.der = der;
    }

}
