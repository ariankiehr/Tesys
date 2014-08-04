package org.tesys.core.analysis.sonar;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.apache.tools.ant.Project;
import org.apache.tools.ant.ProjectHelper;
import org.tesys.core.analysis.sonar.metricsdatatypes.Metrics;
import org.tesys.core.analysis.telemetry.util.Searcher;
import org.tesys.core.db.Database;
import org.tesys.core.project.scm.RevisionPOJO;
import org.tesys.core.project.scm.SCMManager;


public class SonarAnalizer {

  private static final String USER_HOME = "user.home";

  public static final File BUILD_FILE = new File(System.getProperty(USER_HOME), ".tesys/build.xml");

  public static final File WORKSPACE = new File(System.getProperty(USER_HOME), ".tesys/workspace");

  private SCMManager scm;
  private Database db;
  private SonarExtractor sonarExtractor;

  private static SonarAnalizer instance = null;

  private SonarAnalizer() {
    scm = SCMManager.getInstance();
    db = new Database();
    sonarExtractor = new SonarExtractor();
  }

  public static SonarAnalizer getInstance() {
    if (instance == null) {
      instance = new SonarAnalizer();
    }
    return instance;
  }


  /**
   * Consigue todos los commits hechos y agarra los que todavia no fueron analizados por esta misma
   * clase.
   * 
   * Una vez que tiene los no analizados, commit por commit, hace checkouts y ejecuta al sonar por
   * cada checkout.
   * 
   * Luego extrae todos los datos desde la api timemachine de sonar y guarda en la base de datos que
   * revisiones fueron analizadas como asi tambien los analisis
   * 
   * Devuelve true cuando se termina de hacer los analisis.
   * 
   * Esta clase trabaja en la carpeta .tesys del home por defecto, y espera que en dicha carpeta
   * alla un archivo que sea una tarea ant para ejecutar analisis (build.xml)
   * 
   * Como asi tambien guarda los resultados de los checkouts en .tesys/workspace el archivo ant debe
   * estar correctamente configurado para encontrar los codigos en ese lugar
   * 
   */
  public void executeSonarAnalysis() {
    
    //TODO mejorar performace
    //por ejemplo cuando analisisAcumulados es < 2 cortar todo
    //en ves de re calcular la revision previo se puede ir guardando la anterior
    //no traer los analisis que no se usan?
    
    List<AnalisisPOJO> analisisAcumulados = getAnalisisAcumulados();
    List<MetricPOJO> metricas = sonarExtractor.getMetrics();
    List<AnalisisPOJO> analisisPorCommit = getAnalisisPorCommit(analisisAcumulados, metricas);
    analisisAcumulados.clear();
    List<AnalisisPOJO> analisisPorTareaAlmacenados = db.getAnalisis();
    
    List<AnalisisPOJO> analisisPorTarea = getAnalisisPorTarea(analisisPorCommit, analisisPorTareaAlmacenados, metricas);    
    
    this.storeAnalysis(analisisPorTarea);
    this.storeMetrics(metricas);

  }
  
  
  
  /* Se tienen todos los resultados del sonar pero estos resultados
   * son acumulados, lo que significa que el analisis de la revision 3 va a tener
   * la cantidad de lineas de la revision 1, 2 y 3.
   * Para que estos analisis se puedan utilizar apropiadamente hay que obtener las
   * verdaderas metricas del commit en cuestion */
  
  public List<AnalisisPOJO> getAnalisisAcumulados() {
    List<RevisionPOJO> revisiones = db.getRevisions();
    
    Collections.sort( revisiones );
    
    //Se sacan todas las escaneadas menos la ultima (que va a servir de referencia)
    for (int i = 1; i < revisiones.size(); i++) {
      if( ! revisiones.get(i).isScaned() ) {
        break;
      }
      revisiones.remove(i-1);
      i--;
      
    }

    
    if( revisiones.size() < 2 ) {
      return new LinkedList<AnalisisPOJO>();
    }

    for (RevisionPOJO revision : revisiones) {
      
      //Se realiza un checkout de la revision actual
      // TODO en realidad anda con repo = "" pero habria que usar el otro
      // scm.doCheckout(revSinEscanear[i].getRevision(), revSinEscanear[i].getRepository());
      scm.doCheckout(revision.getRevision(), "");
      
      System.out.println( revision.getRevision() );
      
      //Se analiza con sonar ejecutando una tarea ant
      analizar(BUILD_FILE);

      // Se indica que dicha revision ya fue escaneada asi mas adelante no se vuelve a escanear
      revision.setScaned(true);
      db.store(revision.getID(), revision);

    }
    
    //Una vez que se terminan de analizar las revisiones se pruga el directorio
    purgeDirectory(WORKSPACE);
    
    return sonarExtractor.getResults(revisiones);

  }
  

  /**
   * Executa una tarea ant ubicada en buildFile
   */
  private void analizar(File buildFile) {
    Project p = new Project();
    p.setUserProperty( "ant.file", buildFile.getAbsolutePath() );
    p.init();
    ProjectHelper helper = ProjectHelper.getProjectHelper();
    p.addReference( "ant.projectHelper", helper );
    helper.parse( p, buildFile );
    p.executeTarget( p.getDefaultTarget() );
  }


  /**
   * Dado un directorio elimina el contenido pero no el directorio
   */
  private void purgeDirectory(File dir) {
    for (File file : dir.listFiles()) {
      if (file.isDirectory()) {
        purgeDirectory(file);
      }
      file.delete();
    }
  }
  
  
  
  public void storeMetrics(List<MetricPOJO> metrics) {

    for (MetricPOJO metric : metrics) {
      db.store( metric.getID(), metric );
    }
  }
  
  

  public void storeAnalysis(List<AnalisisPOJO> resultados) {

    for (AnalisisPOJO analisis : resultados) {
      db.store( analisis.getID() ,analisis );
    }

  }
  
  
  public List<AnalisisPOJO> getAnalisisPorCommit(List<AnalisisPOJO> analisisAcumulados, List<MetricPOJO> metricas) {

    /*
     * El acumulado en [0] ya esta guardado en la db por commit, aca nomas se va a usar
     * para tener una referencia de las metricas que no corresponden pero no se debe almacenar denuevo
     */
    
    List<AnalisisPOJO> analisisPorCommit = new LinkedList<AnalisisPOJO>();

    //Por cada analisisAcumulado salvo por el primero que es de referencia
    for (int i = 1; i < analisisAcumulados.size(); i++) {
      
      //Agarro los dos analisis que voy "a restar"
      AnalisisPOJO analisisAcumuladoPrevio = analisisAcumulados.get(i - 1);
      AnalisisPOJO analisisAcumuladoActual = analisisAcumulados.get(i);
      //Creo un nuevo analisis que es correspondiente a la revision del que se le van a restar valores
      AnalisisPOJO nuevoAnalisisPorCommit = new AnalisisPOJO( analisisAcumuladoActual.getRevision() );

      List<KeyValuePOJO> resultadosPrevios = analisisAcumuladoPrevio.getResults();
      List<KeyValuePOJO> resultadosActuales = analisisAcumuladoActual.getResults();
      
      //Por cada una de los resultados (de la forma: "lines" = "10")
      for (int j=0; j<resultadosActuales.size(); j++) {
        
        //Se crea un metricHandler, que es quien sabe que hacer con el dato (caso de lineas es restar)
        //pero otro tipo de metricas requiere un tipo diferente de diferencia
        Metrics metricHandler = null;
        //metric name es por ejemplo "lines"
        String metricName = resultadosActuales.get(j).getKey();
        //Los valores actuales y anteriores, por ejemplo 2 y 10, por lo que el valor final debe ser 8
        String valorActual = resultadosActuales.get(j).getValue();
        String valorPrevio = resultadosPrevios.get(j).getValue();
        
        //dado "lines" se obtiene toda la informacion de ese tipo de metrica
        MetricPOJO metric = Searcher.searchMetric(metricName, metricas);
        //En particular el tipo (que los define Sonar), el caso de lines es INT
        //Y este tipo sirve para llamar el metricHandler apropiado
        String metricType = metric.getType();

        //Si la metrica vale "null" se descarta (nunca se almacena)
        //"profile" es un dato que se guarda que no es una metrica asi que se ignora
        if (!"null".equals(valorActual) && !"profile".equals(metricName) && !"profile_version".equals(metricName)) {

          /* Se instancia metricHandler en el handler apropiado mediante refleccion
           * Esto es, cada tipo de dato que define sonar para sus metricas (que se pueden ver
           * en la api "/api/metrics") tiene una clase con el mismo nombre.
           * 
           * De esta forma la metrica lines que es de tipo INT (valor que toma metricType)
           * va a ser un new de la clase INT en el paquete metric data type
           * 
           * Se puede implementar esta funcionalidad haciendo una cascada de if con news
           * pero si sequiere agregar una nueva metric hay que modificar esta clase, de esta
           * forma que solo agregar la clase nueva que sea el handler ya andaria.
           */

          Object object = null;

          try {
            object =
                Class.forName("org.tesys.core.analysis.sonar.metricsdatatypes"+ "." + metricType)
                    .getConstructors()[0].newInstance(valorActual, valorPrevio);
            
            
            metricHandler = (Metrics) object;

            //Si se encontro un handler para ese tipo
            if (metricHandler != null) {
              //Se agrega una nueva metrica con valor por commit al analisis por commit
              nuevoAnalisisPorCommit.add( new KeyValuePOJO(metricName, metricHandler.getDifferenceBetweenAnalysis() ) );
            }
            
            
          } catch (InstantiationException | IllegalAccessException | IllegalArgumentException
              | SecurityException | InvocationTargetException | ClassNotFoundException e) {
            System.err.println( e.getMessage());
          }

        }

      }
      
      //Una vez calculadas todas las metricas se agrega un nuevo analisis por commit al resultado
      analisisPorCommit.add(nuevoAnalisisPorCommit);

    }

    return analisisPorCommit;
  }
  
  
  
  /**
   * Junta las metricas de uno o varios commits correspondientes a la misma tarea de jira
   * 
   * @param analisisJsonPorCommit analisis por commit generador por esta misma clase
   * @param revisiones los datos de las revisiones generados por la clase svnrevisions
   * @return analisis por tarea de jira
   */
  public List<AnalisisPOJO> getAnalisisPorTarea( List<AnalisisPOJO> analisisPorCommit, List<AnalisisPOJO> analisisPorTareaAlmacenados, List<MetricPOJO> metricas ) {
    
    List<AnalisisPOJO> analisisPorTareaGuardados = analisisPorTareaAlmacenados;
   
    for (AnalisisPOJO commitAnalisis : analisisPorCommit) {
      
      AnalisisPOJO guardado =  Searcher.searchIssue(analisisPorTareaGuardados, 
          commitAnalisis.getRevision().getProjectTrackingTask());
      
      if( guardado == null ) {
        //Si todavia no existe la tarea se guarda el analisis sin los datos propios de un commit
        commitAnalisis.getRevision().setDate(0);
        commitAnalisis.getRevision().setRevision(null);
        commitAnalisis.getRevision().setRepository(null);
        analisisPorTareaGuardados.add( commitAnalisis );
      } else {
        
        
        AnalisisPOJO nuevoAnalisisPorTarea = new AnalisisPOJO(guardado.getRevision());
        

        List<KeyValuePOJO> resultadosPrevios = guardado.getResults();
        List<KeyValuePOJO> resultadosActuales = commitAnalisis.getResults();
        
        analisisPorTareaGuardados.remove(guardado);

        for (int j=0; j<resultadosActuales.size(); j++) {
          
          Metrics metricHandler = null;
          String metricName = resultadosActuales.get(j).getKey();
          String valorActual = resultadosActuales.get(j).getValue();
          
          String valorPrevio = Searcher.searchMetricValue(resultadosPrevios, metricName );
          
          if( valorPrevio != null ) {
            MetricPOJO metric = Searcher.searchMetric(metricName, metricas);
            String metricType = metric.getType();

            Object object = null;

            try {
              object =
                  Class.forName( "org.tesys.core.analysis.sonar.metricsdatatypes" + "." + metricType)
                      .getConstructors()[0].newInstance(valorActual, valorPrevio);
            } catch (InstantiationException | IllegalAccessException | IllegalArgumentException
                | SecurityException | InvocationTargetException | ClassNotFoundException e) {
              System.err.println( e.getMessage() );
            }


            metricHandler = (Metrics) object;

            if (metricHandler != null) {

              nuevoAnalisisPorTarea.add( new KeyValuePOJO(metricName, metricHandler.getNewAnalysisPerTask()) );
            }
            
          }


        }
        analisisPorTareaGuardados.add(nuevoAnalisisPorTarea);
        
      }
      
    }
    
    return analisisPorTareaGuardados;
  }

}
