package edu.csumb.s18.cst438.jabb.backend.data.locations;

import edu.csumb.s18.cst438.jabb.backend.data.shared.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import javax.jws.WebService;
import java.util.List;
import java.util.concurrent.ExecutionException;

@WebService
public class LocationService {
    @Autowired
    public LocationRepo repo;
    public LocationService(){

    }
    @GetMapping("/locations/near")
    public List<Location> getLocationsNear(
            @RequestParam("lat") Double lat,
            @RequestParam("lon") Double lon,
            @RequestParam("range") Double range) throws ExecutionException, InterruptedException {
        return (List<Location>) repo.getLocationsNear(lat,lon,range).toList();

    }
}
