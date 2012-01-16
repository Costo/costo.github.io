---
layout: post
title: Using Node.js to extract data from a web page script
---

A few weeks ago, I needed to extract data from the Barclays Cycle Hire [bike map][1] because unlike other bike sharing systems, they don't provide their data in an easily machine readable format. The only option we have to get the location of the station and the bikes availability is to scrape the data from  their website.
In comparison, [Capital BikeShare][3] (Washington DC) provide realtime data of the system in this [xml file][2].

[1]: https://web.barclayscyclehire.tfl.gov.uk/maps "Barclays Cycle Hire map"
[2]: http://capitalbikeshare.com/stations/bikeStations.xml
[3]: http://www.capitalbikeshare.com/ "Capital BikeShare"


Even if we don't have access to the data in a nice xml file for London, there's a big <code>&lt;script&gt;</code> for generating the Google Maps markers embedded in the html source of the page.
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
But I wondered if there was a way to do it in Node.js because, hey, it's way cooler than regular expressions. The idea is to execute the script, but instead of adding markers on the map, we would just output the data passed to <code>google.maps.Marker</code>.

Node.js provides a [VM module][vm] with some methods to execute the JavaScript code it's given to. We just have to extract the script from the page and feed it to  <code>vm.runInNewContext(code, [sandbox], [filename])</code> .

> &shy;<code>vm.runInNewContext</code> compiles <code>code</code> to run in <code>sandbox</code>
> as if it were loaded from <code>filename</code>,
> then runs it and returns the result. Running code does not have access to local scope and
> the object <code>sandbox</code> will be used as the global object for <code>code</code>.
> <code>sandbox</code> and <code>filename</code> are optional.

[PyBikes]: https://github.com/eskerda/PyBikes/blob/master/lib/barclays.py
[vm]: http://nodejs.org/docs/latest/api/vm.html

Here is the script I came up with:

{% highlight javascript %}

    var https = require('https'),
       vm = require('vm');

    https.get({ host: 'web.barclayscyclehire.tfl.gov.uk', path: '/maps' }, function (res) {
        /*  Will store chunks of data while
            we read the response */
        var data = [],
        /*  This array will store individual map markers
            as they are being created by the script */
            markers = [],
        /*  The sandbox is the minimal environment
            required to run the script. It consists of dummy
            properties and methods, except for the Marker function.
            The Marker function is invoked by the script to add
            markers on the map. Instead, we can just store the data in the markers array */
            sandbox = {
                map: {},
                imageInstalled: {},
                ShowInfoBulle: function () { },
                google: {
                    maps: {
                        LatLng: function () { },
                        Marker: function (data) {
                            markers.push(JSON.stringify(data));
                        }
                    }
                }
            };

        res.on('data', function (d) {
            // Store each chunck of data
            data.push(d);
        });

        res.on('end', function () {
            /*  RegExp to extract script tags from the page 
                Yes we still need Regular Expressions! */
            var pattern = /<script[^>]*>([\s\S]*?)<\/script>/ig,
            /*  The whole page content */
                page = data.join(''),
            /*  Will contain RegExp matches */
                match;
            // Loop on each RegExp matches
            while (match = pattern.exec(page)) {
                // Look for the 'genateScript' function in the script
                // This is the function that is normaly executed to place
                // markers on the map
                if (match[1].indexOf('genateScript') > -1) {
                    // Run the script in the sandbox
                    vm.runInNewContext(match[1], sandbox);
                    // The 'genateScript' function should now be defined in the sandbox
                    // Execute it
                    sandbox.genateScript();
                    break;
                }
            }

            // The markers array has been populated when we executed the genateScript function
            // Write the results  in JSON to the standard output
            process.stdout.write('[' + markers.join(', ') + ']');
        });

    }).on('error', function (e) {
        console.error(e);
    });

{% endhighlight %}

And that's all! 
Run <code>node script.js</code> and it outputs an array of 400+ stations.

It was my first attempt at using Node.js and I found it pretty straightforward.