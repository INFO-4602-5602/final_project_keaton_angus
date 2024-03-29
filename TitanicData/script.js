// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 550 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#div1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g");
var dimensionCopy = ["Class", "Age", "Gender (M:1, F:2)", "Sibling/Spouse", "Parent/Child", "Fare (log scale)"];


var form = document.getElementById('dimension-form');
form.onsubmit = function(e){
     e.preventDefault();
     var values = [];
     console.log("lol");
     for (x = 0; x < document.getElementsByTagName('input').length; x++) {
          if (document.getElementsByTagName('input').item(x).type == 'checkbox' && document.getElementsByTagName('input').item(x).checked == true) {
                values.push(document.getElementsByTagName('input').item(x).value);
          }
     }
     dimensionCopy = values;
     console.log(dimensionCopy)
     drawBlank();
     drawCSV();
}
function drawBlank(){
     svg.selectAll("*").remove();

}
function drawCSV(){
     d3.csv("clean_titanic_data.csv", function(data) {
          // Input survival code (0 or 1), return color (black or green)
          var color = d3.scaleOrdinal()
          .domain(["0", "1"])
          .range([ "#CC3E14", "#143ACC"])
          var colorAB = d3.scaleOrdinal()
          .domain(["a", "b"])
          .range([ "#CC3E14", "#143ACC"])
          // List of axes in order from left to right
          dimensions = dimensionCopy;
          //dimensions = ["Class", "Age"]
          // For each dimension (axis), build a scale (e.g. linear or logarithmic)
          var y = {}
          for (i in dimensions) {
               name = dimensions[i]
               if (name == "Class"){
                    y[name] = d3.scaleLinear()
                    .domain( [0,3] ) // static domain for class 'y' axis
                    .range([height, 0])
               }
               else if (name == "Gender (M:1, F:2)"){
                    y[name] = d3.scaleLinear()
                    .domain( [0,3] )
                    .range([height, 0])
               }
               else if (name == "Age"){
                    y[name] = d3.scaleLinear()
                    .domain( d3.extent(data, function(d) { return +d[name]; }) ) //dynamic domain (let program calculate value ranges)
                    .range([height, 0])
               }
               else if (name == "Sibling/Spouse"){
                    y[name] = d3.scaleLinear()
                    .domain( d3.extent(data, function(d) { return +d[name]; }) )
                    .range([height, 0])
               }
               else if (name == "Parent/Child"){
                    y[name] = d3.scaleLinear()
                    .domain( d3.extent(data, function(d) { return +d[name]; }) )
                    .range([height, 0])
               }
               else if (name == "Fare (log scale)"){ // log scale to prevent concentration (most fares were relatively cheap)
                    y[name] = d3.scaleLog()
                    .domain( d3.extent(data, function(d) { return +d[name]; }) )
                    .range([height, 0])
               }
          }
          // Build the X scale -> it find the best position for each Y axis
          x = d3.scalePoint()
          .range([0, width])
          .domain(dimensions);

          // Highlight the survival code being hovered
          var highlight = function(d){
               survivedd = d["Survived Highlight Code"]
               // first every group turns grey
               d3.selectAll(".line")
               .transition().duration(200)
               .style("stroke", "lightgrey")
               .style("opacity", "0.2")
               // then the hovered group highlights to its original color
               d3.selectAll(".line").filter(function(dd) {return dd["Survived Highlight Code"] == survivedd;})
               .transition().duration(200)
               .style("stroke", colorAB(survivedd))
               .style("opacity", "0.95")
          }
          // Unhighlight (when mouse off)
          var doNotHighlight = function(d){
               d3.selectAll(".line")
               .transition().duration(200).delay(50)
               .style("stroke", function(d){ return( color(d.Survived))} )
               .style("opacity", "0.95")
          }
          // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
          function path(d) {
               return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
          }
          // Draw the lines
          svg
          .selectAll("myPath")
          .data(data)
          .enter()
          .append("path")
          .attr("class", function (d) { return "line " + d.Survived } ) // 2 class for each line: 'line' and the group name
          .attr("d",  path)
          .style("fill", "none" )
          .style("stroke", function(d){ return( color(d.Survived))} )
          .style("opacity", 0.5)
          .on("mouseover", highlight)
          .on("mouseleave", doNotHighlight )
          
          // Draw the axis:
          svg.selectAll("myAxis")
          // For each dimension of the dataset I add a 'g' element:
          .data(dimensions).enter()
          .append("g")
          .attr("class", "axis")
          // I translate this element to its right position on the x axis
          .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
          // And I build the axis with the call function
          .each(function(d) { d3.select(this).call(d3.axisRight().ticks(4).scale(y[d])); })
          // Add axis title
          .append("text")
          .style("text-anchor", "middle")
          .attr("y", 9)
          .text(function(d) { return d; })
          .style("fill", "black")
     })
}

// Parse the Data
d3.csv("clean_titanic_data.csv", function(data) {
     // Input survival code (0 or 1), return color (black or green)
     var color = d3.scaleOrdinal()
     .domain(["0", "1"])
     .range([ "#CC3E14", "#143ACC"])
     var colorAB = d3.scaleOrdinal()
     .domain(["a", "b"])
     .range([ "#CC3E14", "#143ACC"])
     // List of axes in order from left to right
     dimensions = dimensionCopy;
     //dimensions = ["Class", "Age"]
     // For each dimension (axis), build a scale (e.g. linear or logarithmic)
     var y = {}
     for (i in dimensions) {
          name = dimensions[i]
          if (name == "Class"){
               y[name] = d3.scaleLinear()
               .domain( [0,3] ) // static domain for class 'y' axis
               .range([height, 0])
          }
          else if (name == "Gender (M:1, F:2)"){
               y[name] = d3.scaleLinear()
               .domain( [0,3] )
               .range([height, 0])
          }
          else if (name == "Age"){
               y[name] = d3.scaleLinear()
               .domain( d3.extent(data, function(d) { return +d[name]; }) ) //dynamic domain (let program calculate value ranges)
               .range([height, 0])
          }
          else if (name == "Sibling/Spouse"){
               y[name] = d3.scaleLinear()
               .domain( d3.extent(data, function(d) { return +d[name]; }) )
               .range([height, 0])
          }
          else if (name == "Parent/Child"){
               y[name] = d3.scaleLinear()
               .domain( d3.extent(data, function(d) { return +d[name]; }) )
               .range([height, 0])
          }
          else if (name == "Fare (log scale)"){ // log scale to prevent concentration (most fares were relatively cheap)
               y[name] = d3.scaleLog()
               .domain( d3.extent(data, function(d) { return +d[name]; }) )
               .range([height, 0])
          }
     }
     // Build the X scale -> it find the best position for each Y axis
     x = d3.scalePoint()
     .range([0, width])
     .domain(dimensions);

     // Highlight the survival code being hovered
     var highlight = function(d){
          survivedd = d["Survived Highlight Code"]
          // first every group turns grey
          d3.selectAll(".line")
          .transition().duration(200)
          .style("stroke", "lightgrey")
          .style("opacity", "0.2")
          // then the hovered group highlights to its original color
          d3.selectAll(".line").filter(function(dd) {return dd["Survived Highlight Code"] == survivedd;})
          .transition().duration(200)
          .style("stroke", colorAB(survivedd))
          .style("opacity", "0.95")
     }
     // Unhighlight (when mouse off)
     var doNotHighlight = function(d){
          d3.selectAll(".line")
          .transition().duration(200).delay(50)
          .style("stroke", function(d){ return( color(d.Survived))} )
          .style("opacity", "0.95")
     }
     // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
     function path(d) {
          return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
     }
     // Draw the lines
     svg
     .selectAll("myPath")
     .data(data)
     .enter()
     .append("path")
     .attr("class", function (d) { return "line " + d.Survived } ) // 2 class for each line: 'line' and the group name
     .attr("d",  path)
     .style("fill", "none" )
     .style("stroke", function(d){ return( color(d.Survived))} )
     .style("opacity", 0.5)
     .on("mouseover", highlight)
     .on("mouseleave", doNotHighlight)
     // Draw the axis:
     svg.selectAll("myAxis")
     // For each dimension of the dataset I add a 'g' element:
     .data(dimensions).enter()
     .append("g")
     .attr("class", "axis")
     // I translate this element to its right position on the x axis
     .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
     // And I build the axis with the call function
     .each(function(d) { d3.select(this).call(d3.axisRight().ticks(4).scale(y[d])); })
     // Add axis title
     .append("text")
     .style("text-anchor", "middle")
     .attr("y", 9)
     .text(function(d) { return d; })
     .style("fill", "black")
})
