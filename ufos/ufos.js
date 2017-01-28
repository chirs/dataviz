
var mapPath = './world-110m2.json'

// var mapPath = 'https://d3js.org/us-10m.v1.json'; 
    
d3.json(mapPath, worldjson=>{
    
    var worlddata = topojson.object(worldjson, worldjson.objects.countries).geometries
    //var worlddata = topojson.object(worldjson, worldjson.objects.states).geometries    
    
    var height = 800;
    var width = 1.5 * height;
    
    var svg = d3.select("#viz")
	.append("svg")
	.attr("height",height)
	.attr("width",width);
    
    var projection = d3.geoMercator();
    var path = d3.geoPath(projection);
    
    svg.selectAll("path")
	.data(worlddata)
	.enter()
	.append("path")
	.attr("d",path);
    
    svg.append("text")
	.attr("class","yearLabel")
	.attr("x",50)
	.attr("y",.5*height)
	.text("1900");

    svg.append("text")
	.attr("class","pause")
	.attr("x",50)
	.attr("y",.6*height)
	.text("||");

    d3.json('./ufos.json', ufos=>{

	var ufos = ufos.filter(function(d){return d.lon < -20}); // set location to USA
	
	var data = _.groupBy(ufos,ufo=>ufo.newDate.substring(0,4));
	var years = _.keys(data);
	var timeLapse = 800;
	var t = d3.transition().duration(.5*timeLapse);

	//console.log(data[2000][0]);

	colorMap = {
	    oval: "#0000ff",
	};

	var getColor = function(shape){
	    color = colorMap[shape];
	    if (color == undefined){
		return "#000000"}
	    else {
		return color;
	    }
	}

	var removePoints = function(){
	    svg.selectAll("circle")
		//.transition(t) // this was causing pulsing / missing elements somehow?
		.attr("r",0)
		.remove();
	};

	var displayYear = function(year){
	    d3.select("text.yearLabel").text(year);

	    svg.selectAll("circle")
		.data(data[year])
		.enter()
		.append("circle")
		.attr("cx",d=>projection([d.lon,d.lat])[0])
		.attr("cy",d=>projection([d.lon,d.lat])[1])
		.transition(t)
		.attr("r",3)
		//.on("mouseover", function(d){
		//    console.log("mouse");
		//});
	};

	var intervalFunc = function(elapsed){
	    var whichKey = Math.floor(elapsed/timeLapse % years.length);
	    var year = years[whichKey];
	    removePoints();
	    displayYear(year);
	}

	//displayYear(2000);
	d3.interval(intervalFunc, timeLapse)

	
    })
    
})
