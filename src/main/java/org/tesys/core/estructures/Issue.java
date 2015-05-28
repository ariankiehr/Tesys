package org.tesys.core.estructures;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.tesys.core.analysis.skilltraceability.Skill;

/**
 * Esta clase representa un Issue final. Es decir, tiene un par de atributos
 * para poder identificarlo y un mapa con cad valor que los programas
 * suministraron sobre ese issue el paquete telemetry es el encargado de generar
 * instancias de esta clase en base a todos los datos que hay de cada programa
 */
public class Issue {

    private String issueId;
    private String user;
    private String issueType;
    private String[] labels;

    Map<String, Double> measures;
    List<Puntuacion> puntuaciones;
    List<Skill> skills;

    public Issue() {
	// for jackson
    }

    public Issue(String issueId) {
	super();
	this.issueId = issueId;
	measures = new HashMap<String, Double>();
	puntuaciones = new LinkedList<Puntuacion>();
    }
    
    public Issue(String issueId, String user, String issueType, Map<String,Double> measures, List<Skill> skills) {
    	this.issueId = issueId;
    	this.user = user;
    	this.issueType = issueType;
    	this.measures = measures;
    	this.skills = skills;
    	this.puntuaciones = new LinkedList<Puntuacion>();
    }
    
    

	public List<Skill> getSkills() {
		return skills;
	}

	public void setSkills(List<Skill> skills) {
		this.skills = skills;
	}

	public String getIssueId() {
	return issueId;
    }

    public void setIssueId(String issueId) {
	this.issueId = issueId;
    }

    public String getUser() {
	return user;
    }

    public void setUser(String user) {
	this.user = user;
    }

    public String getIssueType() {
	return issueType;
    }

    public void setIssueType(String issueType) {
	this.issueType = issueType;
    }

    public Map<String, Double> getMetrics() {
	return measures;
    }

    public void setMetrics(Map<String, Double> metrics) {
	this.measures = metrics;
    }

    public void addMetric(String k, Double v) {
	this.measures.put(k, v);
    }

    public void addMetric(String k, Integer v) {
	this.addMetric(k, v.doubleValue());
    }
    
    public List<Puntuacion> getPuntuaciones() {
        return puntuaciones;
    }

    public void setPuntuaciones(List<Puntuacion> puntuaciones) {
        this.puntuaciones = puntuaciones;
    }
    
    public void addPuntuation(Puntuacion p) {
	this.puntuaciones.add(p);
    }

	public String[] getLabels() {
		return labels;
	}

	public void setLabels(String[] labels) {
		this.labels = labels;
	}
    
    
}
