package org.tesys.core.estructures.metricvalue;

import org.tesys.core.estructures.Issue;

/**
 * Ivalue es un decorate que se utiliza para poder obtener un valor numerico de
 * un issue, dependiendo de como se haya instanciado (que indica el tipo de
 * metrica)
 * 
 */

public interface IValue {
    Double evaluate(Issue issue);
}
