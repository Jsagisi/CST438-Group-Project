package edu.csumb.s18.cst438.jabb.backend.data.locations;

import com.firebase.geofire.GeoLocation;
import io.reactivex.disposables.Disposable;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.concurrent.ExecutionException;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class LocationRepoTest {

    @Autowired
    private LocationRepo repo;

    @Test
    public void getLocationsNear() throws ExecutionException, InterruptedException {
        repo.getLocationsNear(86, 0, 3).blockingForEach(l -> System.out.println(l.getName()));


    }

}