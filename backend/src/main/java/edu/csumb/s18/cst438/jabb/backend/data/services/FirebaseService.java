package edu.csumb.s18.cst438.jabb.backend.data.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import java.io.FileInputStream;
import java.io.IOException;

@Service
public class FirebaseService {
    private FirebaseDatabase fireBase;
    private Firestore fireStore;
    private GoogleCredentials getCredentials(Environment env) throws IOException {
        if (env.getProperty("backend.credentialSource").equals("File")) {
            System.out.println(env.getProperty("backend.credential.path"));
            return GoogleCredentials.fromStream(new FileInputStream(env.getProperty("backend.credential.path")));
        } else {
            throw new NotImplementedException();
        }
    }
    public FirebaseService(@Autowired Environment env) throws IOException {
        GoogleCredentials googleCredentials=getCredentials(env);
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(googleCredentials)
                .setDatabaseUrl("https://cst438-project-80304.firebaseio.com/")
                .build();
        FirebaseApp.initializeApp(options);
        fireBase=FirebaseDatabase.getInstance();
        fireStore=FirestoreClient.getFirestore();
    }
    public DatabaseReference getLocationsReference(){
        return fireBase.getReference("locations");
    }
    public CollectionReference getUsersReference(){
        return fireStore.collection("users");
    }
}
