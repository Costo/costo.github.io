---
layout: post
title: Rdio Frame for Boxee
---

At home I listen to music almost exclusively on my TV, via [Boxee](http://www.boxee.tv/).
After evaluating a few music streaming services recently, I decided to subscribe to [Rdio](http://www.rdio.com/#/people/Costo/) as it responded to my two main criteria:
* Available in Canada
* Works in Boxee

Indeed Rdio works in Boxee but unlike with Grooveshark or Spotify, there's no app for that. Instead it simply runs in the Boxee web browser. Navigating with the remote is a bit painful at first but you get used to it. However, one thing that was bothering me is that the browser is always "on", and the screensaver never starts. I guess it's ok when you want to watch a video, but with music, once you've created your playlist, you just need the sound, and the screen not really.

That's why I created [Rdio Frame for Boxee](https://github.com/Costo/rdioframe). It is just a simple html page that runs Rdio in an `<iframe>` and adds areas on both sides of the screen that will replace Rdio by a black background when clicked. On my TV it triggers the economy mode after a few seconds so I even save some energy even though I have no idea how much a difference it makes...

It took me about ten minutes to have the first prototype and after a few fixes and improvements I'm quite satisfied with the result. You can [open it](http://costo.github.com/rdioframe/) with any Webkit browser but it is really intended to be used with a [720p resolution](http://forums.boxee.tv/showthread.php?t=39491).