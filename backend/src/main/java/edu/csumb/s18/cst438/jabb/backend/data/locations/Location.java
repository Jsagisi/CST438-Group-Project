package edu.csumb.s18.cst438.jabb.backend.data.locations;

import com.firebase.geofire.GeoLocation;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseReference;

public class Location {
    private String name;
    private String address;

    @Override
    public String toString() {
        return "Location{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", location=" + location +
                ", currentChampionKey='" + currentChampionKey + '\'' +
                '}';
    }

    public GeoLocation getLocation() {
        return location;
    }

    private GeoLocation location;

    public Location(DataSnapshot snapshot) {
        this(
                snapshot.child("name").getValue(String.class),
                snapshot.child("address").getValue(String.class),
                new GeoLocation(
                        snapshot.child("l").child("0").getValue(Double.class),
                        snapshot.child("l").child("1").getValue(Double.class)),
                snapshot.child("currentChampionKey").getValue(String.class));

    }

    public Location(String name, String address, GeoLocation location, String currentChampionKey) {
        this.name = name;
        this.address = address;
        this.location = location;
        this.currentChampionKey = currentChampionKey;
    }

    public String getAddress() {

        return address;
    }

    public String getCurrentChampionKey() {
        return currentChampionKey;
    }

    private String currentChampionKey;

    public String getName() {
        return name;
    }

    public Location() {
        this.name = "";
        this.address = "";
        this.currentChampionKey = "";
        this.location=new GeoLocation(0,0);
    }

}
