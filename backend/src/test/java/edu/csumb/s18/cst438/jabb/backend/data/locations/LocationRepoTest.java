package edu.csumb.s18.cst438.jabb.backend.data.locations;

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
    public void getAllLocations() throws ExecutionException, InterruptedException {
        List<Location> locations=repo.getAllLocations();
        for (Location l:
             locations) {
            System.out.println(l.getName());
        }

    }
}