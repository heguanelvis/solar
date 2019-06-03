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
  console.log(data);
  graph
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", geoGenerator)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("fill", "red");
});
