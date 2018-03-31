package edu.csumb.s18.cst438.jabb.backend.data.locations;




import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.*;

@Repository
public class LocationRepo {
    private final Firestore db;

    private Environment env;
    private  GoogleCredentials getCredentials() throws IOException {
        if(env.getProperty("backend.credentialSource").equals("File")){
            System.out.println(env.getProperty("backend.credential.path"));
            return GoogleCredentials.fromStream(new FileInputStream(env.getProperty("backend.credential.path")));
        }else{
            throw new NotImplementedException();
        }
    }
    public LocationRepo(@Autowired Environment env) throws IOException {

        this.env=env;

        GoogleCredentials googleCredential= getCredentials();

        FirebaseOptions options=new FirebaseOptions.Builder()
                .setCredentials(googleCredential)
                .build();
        FirebaseApp.initializeApp(options);
        db=FirestoreClient.getFirestore();


    }
}
