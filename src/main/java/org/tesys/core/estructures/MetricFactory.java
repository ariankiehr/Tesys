package org.tesys.core.estructures;

import java.io.IOException;

import org.tesys.core.estructures.metrictypes.MetricTypeDescriptor;
import org.tesys.core.estructures.metrictypes.NumericMetric;
import org.tesys.core.estructures.metrictypes.PercentMetric;
import org.tesys.core.estructures.metricvalue.IValue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MetricFactory {

	public Metric getMetric(String jsonFormat) throws IOException {
		ObjectMapper mapper = new ObjectMapper();

		JsonNode o = null;
		Metric m;
		try {
			o = mapper.readTree(jsonFormat);
			IValue v = getValue(o.get("value"));
			MetricTypeDescriptor t = getType(o.get("type"));
			m = new Metric(o.get("key").asText(), o.get("nombre").asText(), o
					.get("descripcion").asText(),
					o.get("procedencia").asText(), v, t);
		} catch (IOException e) {
			throw e;
		}

		return m;

	}

	private MetricTypeDescriptor getType(JsonNode jsonNode)
			throws RuntimeException {

		try {
			if (jsonNode != null && jsonNode.asText().equals("numeric")) {
				return new NumericMetric();
			}

			if (jsonNode != null && jsonNode.asText().equals("percent")) {
				return new PercentMetric();
			}
		} catch (Exception e) {
			throw e;
		}

		throw new RuntimeException("undefined type");
	}

	public Metric getMetric(JsonNode jsonFormat) throws NullPointerException {

		IValue v;
		MetricTypeDescriptor t;
		try {
			if (jsonFormat != null && jsonFormat.get("value") != null
					&& jsonFormat.get("type") != null) {
				v = getValue(jsonFormat.get("value"));
				t = getType(jsonFormat.get("type"));
			} else {
				System.out.println(jsonFormat.get("key"));
				throw new NullPointerException();
			}
		} catch (Exception e) {
			throw e;
		}

		return new Metric(jsonFormat.get("key").asText(), jsonFormat.get(
				"nombre").asText(), jsonFormat.get("descripcion").asText(),
				jsonFormat.get("procedencia").asText(), v, t);

	}

	public IValue getValue(JsonNode json) {

		if (json.isContainerNode()) {
			JsonNode j = json.elements().next();
			if (j.isArray()) {
				// nodo
				IValue v1 = getValue(j.get(0));
				IValue v2 = getValue(j.get(1));
				try {
					return (IValue) Class.forName(
							"org.tesys.core.estructures.metricvalue."
									+ json.fieldNames().next().toString())
							.getConstructors()[0].newInstance(v1, v2);
				} catch (Exception e) {
				}

			} else if (!json.isArray()) {
				// hoja
				try {
					return (IValue) Class.forName(
							"org.tesys.core.estructures.metricvalue."
									+ json.fieldNames().next().toString())
							.getConstructors()[0].newInstance(json.elements()
							.next().asText());
				} catch (Exception e) {
				}

			}

		}

		return null;
	}

}
