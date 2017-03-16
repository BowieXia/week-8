/* ================================
Week 6 Assignment: Slide Model
================================ */

/** Here's a simple 'model' of a slide.
 *  It tracks the slide's index and the title we want in our HTML
 */
var FirstSlide = {
  slideNumber: 1,
  title: "My first slide"
  //In this page, time line of food inspection will be presented.
  //Show all the restaurants as points in the map in blue at first
  //Then some of them turn to red if they failed the inspection. Passed points will turn green
};

var SecondSlide = {
  slideNumber: 2,
  title: "My Second slide"
  //In this page, There will be two layers
  //In the bottom layer, the radius of circles will be bigger, using color to show the types of restaruant
  //In the top layer, the radius of circles will be smaller, using red or green to show the inspection results
};

var ThirdSlide = {
  slideNumber: 3,
  title: "My Third slide"
  //In this page, using selection function to select the points in the map
  //Display passed points only or failed points only
};

var ForthSlide = {
  slideNumber: 4,
  title: "My Forth slide"
  //Violation Filter, using a filter to select the restaruant by violation types
};

var FifthSLide = {
  slideNumber: 5,
  title: "My Fifth slide"
  //Final analysis result: maybe using one hot map to show the results
};
