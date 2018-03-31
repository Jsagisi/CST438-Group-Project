package edu.csumb.s18.cst438.jabb.backend.data.locations;

public class Location {
    private String name;

    public String getName() {
        return name;
    }
    public Location(){
        this.name=null;
    }
    public Location(String name) {
        this.name = name;
    }
}
