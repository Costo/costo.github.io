---
layout: post
title: Using Node.js to extract data from a web page
excerpt: |-
  A few weeks ago, I needed to extract data from the Barclays Cycle Hire bike map. Unlike other bike sharing systems, they don't provide their data in an easily machine readable format.
---

A few weeks ago, I needed to extract data from the Barclays Cycle Hire [bike map][1]. Unlike other bike sharing systems, they don't provide their data in an easily machine readable format.
For instance, here is the [xml file][2] containing realtime data for the [Capital BikeShare][3] system in Washington, DC.

[1]: https://web.barclayscyclehire.tfl.gov.uk/map "Barclays Cycle Hire map"
[2]: http://capitalbikeshare.com/stations/bikeStations.xml
[3]: http://www.capitalbikeshare.com/ "Capital BikeShare"


Even if we don't have access to the data in a nice xml file, there's a big <code>&lt;script&gt;</code> for generating the map markers embedded in the html source of the page.
This is what it looks like, repeated 400 times:

    function genateScript() { ...
        station = {
            id:"1",
            name:"River Street , Clerkenwell",
            lat:"51.52916347",long:"-0.109970527",
            nbBikes:"9",
            nbEmptyDocks:"10",
            installed:"true",
            locked:"false",
            temporary:"false"
        };
        loadedStations.push(station);
        var latlng = new google.maps.LatLng(station.lat ,station.long); 
        var marker  = new google.maps.Marker({
            position: latlng,
            map: map,
            title:station.name,
            station:station,
            icon: imageInstalled
        });
        ShowInfoBulle(marker, 0, station)

There is all the information we need: station id and name, latitude, longitude and the number of bikes available.
One way to approach this would be to use regular expressions. And it works, that is how they do it in the [PyBikes][] project.
But I wondered if there was a way to do it in Node.js because, hey, it's way cooler than regular expressions.

Node.js provides a [VM module][vm] to execute JavaScript

> JavaScript code can be compiled and run immediately or compiled, saved, and run later.

[PyBikes]: https://github.com/eskerda/PyBikes/blob/master/lib/barclays.py
[vm]: http://nodejs.org/docs/latest/api/vm.html

First we need to extract the script that contains the <code>genateScript</code> function. For that we

