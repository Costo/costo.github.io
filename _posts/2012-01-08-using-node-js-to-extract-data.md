---
layout: post
title: Using Node.js to extract data from a web page script
---

A few weeks ago, I needed to extract data from the Barclays Cycle Hire [bike map][1] because unlike other bike sharing systems, they don't provide their data in an easily machine readable format. The only option we have to get the location of the station and the bikes availability is to scrape the data from  their website.
In comparison, [Capital BikeShare][3] (Washington DC) provide realtime data of the system in this [xml file][2].

[1]: https://web.barclayscyclehire.tfl.gov.uk/maps "Barclays Cycle Hire map"
[2]: http://capitalbikeshare.com/stations/bikeStations.xml
[3]: http://www.capitalbikeshare.com/ "Capital BikeShare"


Even if we don't have access to the data in a nice xml file for London, there's a big `<script>` for generating the Google Maps markers embedded in the html source of the page.
This is what it looks like:

{% highlight javascript %}

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

{% endhighlight %}

... repeated 400 more times ...

Even if it's a bit messy, there is all the information we need: station id and name, latitude, longitude and the number of bikes available.
One way to approach this would be to use regular expressions. And it works, that is how they do it in the [PyBikes][] project.
But I wondered if there was a way to do it in Node.js because, hey, it's way cooler than regular expressions. The idea is to execute the script, but instead of adding markers on the map, we would just output the data passed to `google.maps.Marker`.

Node.js provides a [VM module][vm] with some methods to execute the JavaScript code it's given to. We just have to extract the script from the page and feed it to  `vm.runInNewContext(code, [sandbox], [filename])` .

> &shy;`vm.runInNewContext` compiles `code` to run in `sandbox`
> as if it were loaded from `filename`,
> then runs it and returns the result. Running code does not have access to local scope and
> the object `sandbox` will be used as the global object for `code`.
> `sandbox` and `filename` are optional.

[PyBikes]: https://github.com/eskerda/PyBikes/blob/master/lib/barclays.py
[vm]: http://nodejs.org/docs/latest/api/vm.html

Here is the script I came up with:

<script src="https://gist.github.com/1650831.js?file=BarclaysCycleHire.js">/**/</script>
<noscript>
   <p>No JavaScript? <a href='https://gist.github.com/1650831'>Follow this link</a>.</p>
</noscript>

And that's all! 
Run `node script.js` and it outputs an array of 400+ stations.

It was my first attempt at using Node.js and I found it pretty straightforward.