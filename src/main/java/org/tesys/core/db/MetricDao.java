package org.tesys.core.db;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import javax.ws.rs.core.UriBuilder;

import org.tesys.core.estructures.Metric;
import org.tesys.core.estructures.MetricFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class MetricDao extends ElasticsearchDao<Metric> {

    protected MetricFactory factory = new MetricFactory();

    public MetricDao() {
	super(Metric.class, DEFAULT_RESOURCE_METRIC);
    }

    @Override
    public void create(String id, Metric object) {
	try {
	    client.PUT(UriBuilder.fromPath(resource).path(id).toString(),
		    object.toString());
	} catch (Exception e) {
	    LOG.log(Level.SEVERE, e.toString(), e);
	}
    }

    @Override
    public void update(String id, Metric object) {
	try {
	    client.POST(UriBuilder.fromPath(resource).path(id).toString(),
		    object.toString());
	} catch (Exception e) {
	    LOG.log(Level.SEVERE, e.toString(), e);
	}
    }

    @Override
    public Metric read(String id) {
	try {
	    JsonNode json = client.GET(
		    UriBuilder.fromPath(resource).path(id).path(SOURCE)
			    .toString()).readEntity(JsonNode.class);
	    Metric m = factory.getMetric(json);
	    return m;
	} catch (Exception e) {
	    //LOG.log(Level.SEVERE, e.toString(), e);
	    return null;
	}
    }

    @Override
    public void delete(String id) {
	try {
	    client.DELETE(UriBuilder.fromPath(id).toString());
	} catch (Exception e) {
	    LOG.log(Level.SEVERE, e.toString(), e);
	}
    }

    public List<Metric> readAll() {
	Integer size = this.getSize();

	Map<String, String> param = new HashMap<String, String>();
	param.put("size", size.toString());
	try {
	    ArrayNode jsonResponse = (ArrayNode) client
		    .GET(UriBuilder.fromPath(resource).path(QUERY).toString(),
			    param).readEntity(JsonNode.class).get("hits")
		    .get("hits");
	    return arrayJsonToList(jsonResponse);
	} catch (Exception e) {
	    LOG.log(Level.SEVERE, e.toString(), e);
	    return new ArrayList<Metric>();
	}
    }

    @Override
    protected List<Metric> arrayJsonToList(ArrayNode arrayNode) {
	Iterator<JsonNode> it = null;
	List<Metric> elements = new ArrayList<Metric>();

	try {
	    it = arrayNode.elements();
	} catch (Exception e) {
	    LOG.log(Level.SEVERE, e.toString(), e);
	    return new ArrayList<Metric>();
	}

	while (it.hasNext()) {
	    JsonNode j = ((JsonNode) it.next()).get("_source");
	    try {
		Metric elem = factory.getMetric(j);
		elements.add(elem);
	    } catch (Exception e) {
		LOG.log(Level.SEVERE, e.toString(), e);
		return new ArrayList<Metric>();
	    }
	    it.remove();
	}
	return elements;
    }

}
