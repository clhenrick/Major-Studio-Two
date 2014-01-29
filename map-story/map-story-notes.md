#Map Story project
Telling my brother Mike's story of Hiking the PCT through an interactive media experience.

##Goals
* Create a prototype website with an interactive map and dynamic content that work synchronistically
* Use best practices of open-source and web technology. Eg: Javascript Libraries such as parralax, leaflet, D3, etc.  
  as well as CartoDB, OpenLayers, etc.
* Use spatial-temporal data as the basis for the story
* Create custom cartography for a basemap, markers, etc. that are similar to the printed version.

##Research

###Plaforms:
* mapstory.org
* storymap.js
* storytelling with maps (ESRI, propriertary)
* Neatline (University of VA)

###Articles
* The Atlantic on Neatline [Once Upon a Place](http://www.theatlantic.com/technology/archive/2012/07/once-upon-a-place-telling-stories-with-maps/259787/)
* Engadget.com [Google Earth Tour Builder lets you tell stories through maps](http://www.engadget.com/2013/11/11/google-earth-tour-builder/)

###Precedence
Observations on a few platforms that already exist

####Examples using Google Earth Tour Builder:
* [Defending the Rivers of the Amazon, with Sigourney Weaver](http://www.youtube.com/watch?feature=player_embedded&v=Melq7VA7FjY)
* [Being a Post-9/11 National Guard Member](https://tourbuilder.withgoogle.com/builder#play/ahJzfmd3ZWItdG91cmJ1aWxkZXJyDAsSBFRvdXIY-I0LDA)

####Pros and Cons
1. Google Earth / Tour Builder:  
![google earth tour builder](https://github.com/clhenrick/Major-Studio-Two/blob/raw/master/map-story/images/google-earth-tour-builder-example.png)  
  * Pros: Simple GUI, slick transitions, built in basemap data, can add multi-media (videos, photos, etc), contains lots of tutorials.
  * Cons: It's made by Google & not open-source, can't interact with it programmatically,
    can't change or customize the basemap cartography
2. MapStory.org  
![mapstory.org](https://github.com/clhenrick/Major-Studio-Two/blob/raw/master/map-story/images/mapstory-example.png "MapStory.org")  
  * Pros: Let's users add multi-media, DL data, promotes transparency, users can curate content
  * Cons: Poorly designed UI, limited control over time lapse settings
3. StoryMapJS  
![Storymapjs](https://github.com/clhenrick/Major-Studio-Two/blob/raw/master/map-story/images/story-map-js-example.png "StoryMap JS")  
  * Pros: Interface is a little better designed than MapStory.org, uses Leaflet JS, users can interact programatically with it.
  * Cons: In beta, prone to bugs in browsers.
4. ESRI's Story Telling With Maps  
![ESRI story telling with maps](https://github.com/clhenrick/Major-Studio-Two/blob/raw/master/map-story/images/esri_story-telling-with-maps-example.png "ESRI")  
  * Pros: User can customize the layout somewhat using templates, sort of like Wordpress, can add multimedia, configure pop-ups
  * Cons: Requires access to ArcGIS.com (ESRI's proprietary software which only runs on windows and cost $$$)
5. Neatline  
![Neatline](https://github.com/clhenrick/Major-Studio-Two/blob/raw/master/map-story/images/neatline-example.png "Neatline")  
  * Pros: Open-source, rich control over how content is displayed and created.
  * Cons: Requires a CMS called Omeka, limited capability for sandbox web app. User must set up and install on their own. Too much user control allowing for poor cartography and clunky design
