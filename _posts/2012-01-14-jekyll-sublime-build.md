---
layout: post
title: Adding a Build System for Jekyll in Sublime Text 2
---

I found the documentation for Sublime Text 2 Build Systems on [sublimetext.info](http://sublimetext.info/docs/en/reference/build_systems.html "Build Systems - Sublime Text Help")

To add a new Build System for Jekyll it is very simple
* Go to <code>Tools -> Build System -> New Build System...</code>
* Add the following configuration 

{% highlight python %}

   {
      "cmd": ["C:\\Ruby193\\bin\\jekyll.bat"],
      "working_dir": "${project_path:${folder}}"
   }

{% endhighlight %}

* Of course, make sure the <code>cmd</code> path points to your Jekyll installation
* Save the file and name it <code>jekyll.sublime-build</code>
* Now you can select Jekyll in the list of build systems
* Hit Ctrl+B each time you need to build.

