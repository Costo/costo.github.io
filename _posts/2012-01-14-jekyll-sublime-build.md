---
layout: post
title: Adding a Build System for Jekyll in Sublime Text 2
---

__Edit: 2012-01-15:__
This post is actually useless since you just have to add `auto: true` in Jekyll's \_config.yml 
to trigger the build automatically after a change.
Next time I'll read the documentation first.


I found the documentation for Sublime Text 2 Build Systems on [sublimetext.info](http://sublimetext.info/docs/en/reference/build_systems.html "Build Systems - Sublime Text Help")

To add a new Build System for Jekyll it is very simple
* Go to `Tools -> Build System -> New Build System...`
* Add the following configuration 

{% highlight python %}

   {
      "cmd": ["C:\\Ruby193\\bin\\jekyll.bat"],
      "working_dir": "${project_path:${folder}}"
   }

{% endhighlight %}

* Of course, make sure the `cmd` path points to your Jekyll installation
* Save the file and name it `jekyll.sublime-build`
* Now you can select Jekyll in the list of build systems
* Hit Ctrl+B each time you need to build.

