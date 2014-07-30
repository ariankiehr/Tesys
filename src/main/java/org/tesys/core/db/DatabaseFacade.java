package org.tesys.core.db;


import java.net.MalformedURLException;

import javax.ws.rs.core.Response;

import org.tesys.rest.RESTClient;


public class DatabaseFacade {

  private static final String DEFAULT_LOCATION_CONNECTOR = "http://localhost:8080/core/rest/connectors/elasticsearch"; //$NON-NLS-1$
  RESTClient client;

  
  /**
   * El constructor debe estar para cuando se llama la aplicacion desde el core y no
   * desde rest
   */
  public DatabaseFacade() {
    try {
      client = new RESTClient(DEFAULT_LOCATION_CONNECTOR);
    } catch (MalformedURLException e) {
      e.printStackTrace();
    }
  }

  //TODO analizar como hacer el descubrimiento de servicios
  /*@PUT
  @Path("/config")
  public String changeConnectorLocation(String url) {
    try {
      client.setURL(url);
    } catch (MalformedURLException e) {
      e.printStackTrace();
    }
    return Messages.getString("DatabaseFacade.urlchanged"); //$NON-NLS-1$
  }*/


  //data es un JSON que se almacena
  public String PUT( String index, String dtype, String id, String data ) {
    
    Response response = client.PUT(index + "/" + dtype + "/" + id, data); //$NON-NLS-1$ //$NON-NLS-2$

    return response.readEntity( String.class );
  }

  public String DELETE( String index, String dtype, String id) {
    
    Response response = client.DELETE(index + "/" + dtype + "/" + id); //$NON-NLS-1$ //$NON-NLS-2$

    return response.readEntity( String.class );
  }


  public String GET( String index, String dtype, String id ) {
    
    Response response = client.GET(index + "/" + dtype + "/" + id); //$NON-NLS-1$ //$NON-NLS-2$

    return response.readEntity( String.class );
  }

  //TODO por ahora queda sin uso
  public String POST(String index, String dtype, String query) {
    
    Response response = client.POST(index + "/" + dtype , query); //$NON-NLS-1$
    
    return response.readEntity( String.class );
  }
  
  
  //{"project_tracking_user":"foo","scm_user":"bar","repository":"baz"} = mapeoUserPojo
  //TODO public mapeoUserPOJO getMapeo()
  //{"results":[{"project_tracking_user":"foo","scm_user":"bar","repository":"baz"}]}
  //public String getMapeo( scm , users )
  // fin generacion de query
  //NOMAS SIRVE PARA VER SI EXISTE O NO EL MAPEO, NO IMPORTA LOS DATOS
  
  
  
  
  //TODO
  /* revisiones que se hicieron desde el scm
   * El pojo seria dos string
   * {"results":[{"revision":"1", "repository":"sida"}]}
   * 
   * "scm", "revisions", "{ \"_source\":\"revision\"}" /falta repositorio
   * 
   * Aca importa el dato
   */
  
  
  //TODO
  /* lo mismo que el anterior pero sacarlo de sonar/revisions
   * 
   * Traer todos los datos (sin query)
   * 
   * 
   */
  
  
  
  
  
  
  

}
