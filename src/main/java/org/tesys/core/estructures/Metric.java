package org.tesys.core.estructures;

import org.tesys.core.estructures.metrictypes.MetricTypeDescriptor;
import org.tesys.core.estructures.metricvalue.IValue;

/**
 * Esta clase representa una metrica, una metrica es un medio por el cual se
 * pueden ordenar issues, estas metricas pueden estar definidas por los los
 * programas o por el mismo usuario
 * 
 * Una metrica simple seria lineas de codigo, esta metrica probablemente la
 * defina el sonar y es considerada una metrica simple ya que se encuentra
 * directamente en el mapa de la clase issue
 * 
 * Otra metrica puede ser loc/horas y es considerada una metrica compuesta dado
 * que no se encuentra directamente en issue, sino que debe ser calculada
 * 
 * El conjunto de todas las instancias de esta clase es considerado como todos
 * los tipos de metricas/mediciones que este programa puede soportar
 * 
 */

public class Metric {

    private String key;
    private String nombre;
    private String descripcion;
    private String procedencia;
    private MetricTypeDescriptor type;

	private IValue value;

    public Metric(String key, String nombre, String descripcion,
	    String procedencia, IValue value, MetricTypeDescriptor type) {
	super();
	this.key = key;
	this.nombre = nombre;
	this.descripcion = descripcion;
	this.procedencia = procedencia;
	this.value = value;
	this.type = type;
    }
    
    public MetricTypeDescriptor getType() {
		return type;
	}

	public void setType(MetricTypeDescriptor type) {
		this.type = type;
	}

    public String getKey() {
	return key;
    }

    public void setKey(String key) {
	this.key = key;
    }

    public String getNombre() {
	return nombre;
    }

    public void setNombre(String nombre) {
	this.nombre = nombre;
    }

    public String getDescripcion() {
	return descripcion;
    }

    public void setDescripcion(String descripcion) {
	this.descripcion = descripcion;
    }

    public String getProcedencia() {
	return procedencia;
    }

    public void setProcedencia(String procedencia) {
	this.procedencia = procedencia;
    }

    public IValue getValue() {
	return value;
    }

    public void setValue(IValue value) {
	this.value = value;
    }

    public Double evaluate(Issue issue) {
	return value.evaluate(issue);
    }

    @Override
    public String toString() {
	return "{\"key\":\"" + key + "\", \"nombre\":\"" + nombre
		+ "\", \"descripcion\":\"" + descripcion
		+ "\", \"procedencia\":\"" + procedencia + "\", \"value\":"
		+ value + ", \"type\":\""+ type + "\"}";
    }

}
