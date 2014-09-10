#Map Story project
Telling my brother Mike's story of Hiking the Pacific Crest Trail through an interactive media experience.
This project is inspired by a NY Times article titled [The Russia Left Behind](http://www.nytimes.com/newsgraphics/2013/10/13/russia/).

##Goals
* Create a prototype website with an interactive map and dynamic content that work synchronistically
* Use best practices of open-source and web technology. Eg: Javascript Libraries such as parralax, leaflet, D3, etc.  
  as well as CartoDB, OpenLayers, etc.
* Use spatial-temporal data as the basis for the story
* Create custom cartography for a basemap, markers, etc. that are similar to the printed version.

##Research
Some observations on a few platforms that already exist.

###Plaforms:
* [Google Earth Tour Builder](https://tourbuilder.withgoogle.com/)
* [MapStory.org](http://mapstory.org/)
* [StoryMapJS](http://storymap.knightlab.com/)
* [Storytelling With Maps (ESRI, propriertary)](http://storymaps.esri.com/home/)
* [Neatline (University of VA)](http://neatline.org/)

###Articles
* The Atlantic on Neatline [Once Upon a Place](http://www.theatlantic.com/technology/archive/2012/07/once-upon-a-place-telling-stories-with-maps/259787/)
* Engadget.com [Google Earth Tour Builder lets you tell stories through maps](http://www.engadget.com/2013/11/11/google-earth-tour-builder/)

###Examples 
Google Earth Tour Builder:
  * [Defending the Rivers of the Amazon, with Sigourney Weaver](http://www.youtube.com/watch?feature=player_embedded&v=Melq7VA7FjY)
  * [Being a Post-9/11 National Guard Member](https://tourbuilder.withgoogle.com/builder#play/ahJzfmd3ZWItdG91cmJ1aWxkZXJyDAsSBFRvdXIY-I0LDA)

More example links coming soon...

###Pros and Cons
1. **Google Earth Tour Builder:**  
![google earth tour builder](https://github.com/clhenrick/Major-Studio-Two/raw/master/map-story/images/google-earth-tour-builder-example.png)  
  * **Pros:** Simple GUI, slick transitions, built in basemap data, can add multi-media (videos, photos, etc), contains lots of tutorials.
  * **Cons:** It's made by Google & not open-source, can't interact with it programmatically,
    can't change or customize the basemap cartography  

2. **MapStory.org**  
![mapstory.org](https://github.com/clhenrick/Major-Studio-Two/raw/master/map-story/images/mapstory-example.png "MapStory.org")  
  * **Pros:** Let's users add multi-media, DL data, promotes transparency, users can curate content
  * **Cons:** Poorly designed UI, limited control over time lapse settings  

3. **StoryMapJS**  
![Storymapjs](https://github.com/clhenrick/Major-Studio-Two/raw/master/map-story/images/story-map-js-example.png "StoryMap JS")  
  * **Pros:** Interface is a little better designed than MapStory.org, uses Leaflet JS, users can interact programatically with it.
  * **Cons:** In beta, prone to bugs in browsers.  

4. **ESRI's Story Telling With Maps**  
![ESRI story telling with maps](https://github.com/clhenrick/Major-Studio-Two/raw/master/map-story/images/esri_story-telling-with-maps-example.png "ESRI")  
  * **Pros:** User can customize the layout somewhat using templates, sort of like Wordpress, can add multimedia, configure pop-ups
  * **Cons:** Requires access to ArcGIS.com (ESRI's proprietary software which only runs on windows and cost $$$)  

5. **Neatline**  
![Neatline](https://github.com/clhenrick/Major-Studio-Two/raw/master/map-story/images/neatline-example.png "Neatline")  
  * **Pros:** Open-source, rich control over how content is displayed and created.
  * **Cons:** Requires a CMS called Omeka, limited capability for sandbox web app. User must set up and install on their own. Too much user control allowing for poor cartography and clunky design

##Design Steps
1. Cherry pick from existing platforms to decide what I'd like to improve on.
2. Develop a Wireframe to mock up a website.
3. Code interactivity in Javascript. 
4. Process and prepare data for interactive mapping.
5. Scrape content from [Mike's blog.](http://theuncalculatedlife.blogspot.com/)
