const mapMargin = { left: 75, right: 75, top: 75, bottom: 75 };

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 700);

const graph = svg
  .append("g")
  .attr("tranform", `translate(${mapMargin.left}, ${mapMargin.top})`);

const projection = d3
  .geoAlbersUsa()
  .translate([1000 / 2 + 75, 1000 / 2 - 150])
  .scale([1000]);

const geoGenerator = d3.geoPath(projection);

d3.json("data/us_states.json").then(data => {
  console.log(d3.extent(data.features, d => d.properties.solar_electricity));

  elecThresHold = d3
    .scaleThreshold()
    .domain([0, 5, 50, 1000, 18000, 30000])
    .range(["#ffffff", "#fffac6", "#fff486", "#fcee21", "#f9c524"]);

  mapPath = graph
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", geoGenerator)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("fill", d => elecThresHold(d.properties.solar_electricity));

  mapPath
    .on("mouseover", handleMouseOver.bind(this))
    .on("mouseout", handleMouseOut.bind(this));
});

function handleMouseOver(d, i, n) {
  const centroid = geoGenerator.centroid(d);

  d3.select(n[i]).attr("fill", "white");

  tooltip = graph
    .append("foreignObject")
    .attr("width", 120)
    .attr("height", 54)
    .attr("id", `t-${d.properties.land_area_sq_km}-${i}`)
    .attr("x", centroid[0])
    .attr("y", centroid[1] - 80)
    .html(() => {
      let content = `<div class="tip-style"><div>${d.properties.state}</div>`;
      content += `<div>${d.properties.solar_electricity}</div></div>`;
      return content;
    });
}

function handleMouseOut(d, i, n) {
  d3.select(n[i]).attr("fill", d =>
    elecThresHold(d.properties.solar_electricity)
  );

  d3.select(`#t-${d.properties.land_area_sq_km}-${i}`).remove();
}
