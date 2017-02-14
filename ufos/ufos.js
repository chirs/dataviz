
var mapPath = './world-110m2.json'
    
d3.json(mapPath, worldjson=>{
    
    var countryData = topojson.object(worldjson, worldjson.objects.countries).geometries
    
    var height = 800;
    var width = 1.5 * height;
    
    var svg = d3.select("#viz")
	.append("svg")
	.attr("height",height)
	.attr("width",width);
    
    var projection = d3.geoMercator();
    var path = d3.geoPath(projection);
    
    svg.selectAll("path")
	.data(countryData)
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
	.text("||")

    svg.append("text")
	.attr("class","play")
	.attr("x",100)
	.attr("y",.6*height)
	.text(">")    


    d3.json('./ufos.json', ufos=>{

	var ufos = ufos.filter(function(d){return d.lon < -20}); // set location to USA
	
	var data = _.groupBy(ufos,ufo=>ufo.newDate.substring(0,4));
	var years = _.keys(data);
	var timeLapse = 800;
	var t = d3.transition().duration(.5*timeLapse);

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

	var currentYear = undefined;

	// Modify this to run better with timer.
	var intervalFunc = function(elapsed){
	    var whichKey = Math.floor(elapsed/timeLapse % years.length);
	    var year = years[whichKey];
	    removePoints();
	    displayYear(year);
	}

	//var t = d3.timer(intervalFunc, timeLapse, timeLapse)
	//var t = d3.timer(intervalFunc);

	var t = d3.interval(intervalFunc, timeLapse)
	console.log(t)

	d3.select(".pause").on('click', function(){
	    //d3.select(this).text('p').classed('pause', false).classed('play', true)
	    t.stop();
	    console.log(t);
	});

	d3.select(".play").on('click', function(){
	    //console.log('hello');
	    //d3.select(this).text('||').classed('play', false).classed('pause', true)
	    t.restart(intervalFunc);
	});
    })
    
});
