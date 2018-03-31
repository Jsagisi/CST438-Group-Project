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
