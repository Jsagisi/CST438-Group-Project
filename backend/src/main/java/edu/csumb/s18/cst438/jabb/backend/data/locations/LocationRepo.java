package edu.csumb.s18.cst438.jabb.backend.data.locations;


import com.firebase.geofire.*;
import com.google.api.gax.rpc.ApiStreamObserver;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldPath;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.GeoPoint;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import edu.csumb.s18.cst438.jabb.backend.data.services.FirebaseService;
import edu.csumb.s18.cst438.jabb.backend.data.shared.Location;
import io.reactivex.Observable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.*;

import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;


@Repository
public class LocationRepo {
    private final DatabaseReference db;
    private final GeoFire gf;
    private Environment env;

    /*
    Google want's us to use a file to access firebase, while heroku won't let us upload files.
    Further, the file is to big to put in an environment variable on windows, so making this debuggable AND deployable
    going to be unpleasant. For now, I'm suggesting a system with 3 parts: application configuration, credential files,
    and environment variables.

    The application configuration is kept in application.properties. This configuration should have
    2 relevant keys:
        backend.credentialSource: Which source do we want to read the credentials from, a File or the Environment
        backend.credential.path: The file or environment variable with the relevant credentials
            NOTE: For a file path, an absolute path to the credential file seems to be the only thing that works.
            I'm not entirely sure what the working directory is when this thing launches, so if someone figures
            that out, please mention it.

     I'm aslo suggesting we keep the credential file in (project root)/backend/firebase-credentials.json. I've set up
     the .gitignore file to ignore it already, so none of our keys will leak out to github. You'll all need to generate
     your own keyfiles for the backendserviceaccount member.

     This should give us a pretty good compromise of security and usability, at least for now.
     */


    public LocationRepo(@Autowired FirebaseService firebase) throws IOException {


        db = firebase.getLocationsReference();
        gf = new GeoFire(db);
    }

    //Creates a new location in the database.
    public UUID createLocation(final String name,final String address,final String currentChampionKey,GeoLocation location){
        UUID newId=UUID.randomUUID();

        //If we succeed in creating the new location, we can feel sure that we can set all the
        //rest of the parameters. otherwise we don't want to bother, because there won't be any location to
        //add to.

        //I'm not sure if theres an easier way to add stuff to the database. I think I've seen
        //an example with a Map<String,Object> thing, but I'm not sure.
        gf.setLocation(newId.toString(),location,(key,error)->{

            if(error!=null){
                System.err.println(error);
            }else{
                final DatabaseReference newLocation=db.child(newId.toString());

                //Make some helper functions so we don't have to do a bunch of repeated typing...

                DatabaseReference.CompletionListener cl=(error2,x)->{
                    if(error2!=null){
                        throw error2.toException();
                    }
                };
                BiConsumer<String,String> createKvp=(k, v)->{
                    newLocation.child(k).setValue(v,cl);
                };


                //Add the values here
                createKvp.accept("name",name);
                createKvp.accept("address",address);
                createKvp.accept("currentChampionKey",currentChampionKey);


            }
        });
        return newId;

    }
    /*
    Get locations in a range around the given point.
     */
    public Observable<Location> getLocationsNear(final double lat, final double lon, double range) throws ExecutionException, InterruptedException {
        final GeoQuery query = gf.queryAtLocation(new GeoLocation(lat, lon), range);
        return Observable.create(observer->query.addGeoQueryDataEventListener(new GeoQueryDataEventListener() {
            @Override
            public void onDataEntered(DataSnapshot dataSnapshot, GeoLocation geoLocation) {
                 observer.onNext(new Location(dataSnapshot));
            }

            @Override
            public void onDataExited(DataSnapshot dataSnapshot) {

            }

            @Override
            public void onDataMoved(DataSnapshot dataSnapshot, GeoLocation geoLocation) {

            }

            @Override
            public void onDataChanged(DataSnapshot dataSnapshot, GeoLocation geoLocation) {

            }

            @Override
            public void onGeoQueryReady() {
                observer.onComplete();
            }

            @Override
            public void onGeoQueryError(DatabaseError databaseError) {
                observer.onError(databaseError.toException());
            }
        }));





    }

}
