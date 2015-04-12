package org.tesys.core.plugins.activity;

import java.util.ArrayList;
import java.util.List;
import java.util.Observable;
import java.util.Observer;

import org.tesys.core.db.ElasticsearchDao;
import org.tesys.core.db.ValidDeveloperQuery;
import org.tesys.core.estructures.Metric;
import org.tesys.core.estructures.metrictypes.NumericMetric;
import org.tesys.core.project.scm.RevisionPOJO;
import org.tesys.core.project.scm.SCMManager;


/**
 * Esta clase administra la actividad de los desarrolladores encuanto a
 * escrituras/lecturas hechas por los developers, en el workspace del proyecto.
 * 
 * Es responsable de almacenar la informacion enviada por cada developer y luego
 * asociar toda esa actividad a un issue.
 * 
 * @author leandro
 * 
 */
public class Activity implements Observer {
    // DAO Path
    public static final String READS_PATH = "/activity/reads";
    public static final String WRITES_PATH = "/activity/writes";

    private static Activity instance;
    
    private AcumulativeMeasurer readingMeasurer ;
    private AcumulativeMeasurer writingMeasurer ;
    private List<Measurer> measurers ;

    
    public static synchronized Activity getInstance() {
        if (instance == null) {
            instance = new Activity();
        }
        SCMManager.getInstance().addObserver( instance );
        return instance;
    }

    private Activity() {     
        readingMeasurer = new AcumulativeMeasurer( new ElasticsearchDao<ActivityPOJO>( ActivityPOJO.class, READS_PATH ) ) ;
        writingMeasurer = new AcumulativeMeasurer( new ElasticsearchDao<ActivityPOJO>( ActivityPOJO.class, WRITES_PATH ) ) ;       
        measurers = new ArrayList<Measurer>() ;
        measurers.add( readingMeasurer ) ;
        measurers.add( writingMeasurer ) ;
    }
    
    public boolean validateParams(String user, Integer mins, Integer count) {
        return (mins >= 1) && (count >= 1) ;
        
    }
    
    public synchronized void reading( String user, Integer mins, Integer count ) {
        if (validateParams( user, mins, count )) {
            readingMeasurer.set( user, mins, count );
        }
    }

    public synchronized void writing( String user, Integer mins, Integer count ) {
        if (validateParams( user, mins, count )) {
            writingMeasurer.set( user, mins, count );
        }

    }

    public void joinActivityPerCommit( String issue, String user ) {
        for ( Measurer m : measurers ) {
            m.persist( issue, user );
        }
        
    }
    
    public List<Metric> getMetrics() {
        List<Metric> metrics = new ArrayList<Metric>() ;
        metrics.add( new Metric( "reads", "Cantidad de Lecturas", "Cantidad de veces que el desarrollador leyo archivos de codigo del projecto", "activity", null , new NumericMetric() ) );
        metrics.add( new Metric( "reads_time", "Tiempo en Lecturas", "Tiempo (en minutos) gastado por el desarrollador leyo archivos de codigo del projecto", "activity", null , new NumericMetric()) );
        metrics.add( new Metric( "writes", "Cantidad de Lecturas", "Cantidad de veces que el desarrollador escribio archivos de codigo del projecto", "activity", null, new NumericMetric() ) );
        metrics.add( new Metric( "writes_time", "Tiempo en Lecturas", "Tiempo (en minutos) gastado por el desarrollador escribio archivos de codigo del projecto", "activity", null, new NumericMetric() ) );
        return metrics;
    }

    @Override
    public void update( Observable arg0, Object arg1 ) {
	ValidDeveloperQuery dao = new ValidDeveloperQuery( ((RevisionPOJO)arg1).getScmUser(), ((RevisionPOJO)arg1).getRepository() );
        String user = dao.execute();
	try {
            joinActivityPerCommit( ((RevisionPOJO)arg1).getProjectTrackingTask() , user )  ;
        } catch (Exception e) {
            
        }
    }

}
