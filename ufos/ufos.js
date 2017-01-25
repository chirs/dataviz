
d3.json('./world-110m2.json', worldjson=>{

	var worlddata = topojson.object(worldjson, worldjson.objects.countries).geometries

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

	d3.json('./ufos.json', ufos=>{

		var data = _.groupBy(ufos,ufo=>ufo.newDate.substring(0,4));
		var years = _.keys(data);
		var timeLapse = 500
		var t = d3.transition()
				.duration(.5*timeLapse);

		d3.interval((elapsed)=>{

			var whichKey = Math.floor(elapsed/timeLapse % years.length);
            var year = years[whichKey];
            var yearData = data[year];

            if (year == 1981){
                debugger;
            }
            
			d3.select("text.yearLabel")
				.text(years[whichKey])

			// console.log(elapsed,whichKey,years[whichKey])



		 	svg.selectAll("circle")
		 		.transition(t)
		 		.attr("r",0)
		 		.remove();			

			svg.selectAll("circle")
				.data(data[years[whichKey]])
				.enter()
				.append("circle")
				.attr("cx",d=>projection([d.lon,d.lat])[0])
				.attr("cy",d=>projection([d.lon,d.lat])[1])
				.transition(t)
				.attr("r",3);

		},timeLapse)

	})

})
