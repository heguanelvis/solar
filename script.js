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
  .translate([1000 / 2 + 25, 1000 / 2 - 230])
  .scale([1000]);

const geoGenerator = d3.geoPath(projection);

graph.selectAll("path").remove();
d3.json("data/us_states.json").then(data => {
  document.querySelector(".production-btn").classList.add("btn-map-active");
  productionGraph(data);
});

document.querySelector(".production-btn").addEventListener("click", () => {
  document.querySelector(".production-btn").classList.remove("btn-map-active");
  graph.selectAll("path").remove();
  d3.json("data/us_states.json").then(data => {
    productionGraph(data);
  });
});

document.querySelector(".potential-btn").addEventListener("click", () => {
  document.querySelector(".production-btn").classList.remove("btn-map-active");
  graph.selectAll("path").remove();
  d3.json("data/us_states.json").then(data => {
    potentialGraph(data);
  });
});

document.querySelector(".ratio-btn").addEventListener("click", () => {
  document.querySelector(".production-btn").classList.remove("btn-map-active");
  graph.selectAll("path").remove();
  d3.json("data/us_states.json").then(data => {
    ratioGraph(data);
  });
});

function productionGraph(data) {
  elecThresHold = d3
    .scaleThreshold()
    .domain([0, 5, 50, 1000, 18000, 30000])
    .range(["#000000", "#ffeff1", "#f3bab1", "#df8773", "#c6513a", "#a70000"]);

  mapPath = graph
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", geoGenerator)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("class", "pointer")
    .attr("fill", d => elecThresHold(d.properties.solar_electricity));

  mapPath
    .on("mouseover", handleMouseOverA.bind(this))
    .on("mouseout", handleMouseOutA.bind(this));
}

function potentialGraph(data) {
  poteThresHold = d3
    .scaleThreshold()
    .domain([550, 1400, 1550, 1750, 1900, 2100])
    .range(["#ffffff", "#fffac6", "#fff486", "#fcee21", "#f9c524"]);

  mapPath = graph
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", geoGenerator)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("class", "pointer")
    .attr("fill", d => poteThresHold(d.properties.annual_sunlight_radiation));

  mapPath
    .on("mouseover", handleMouseOverB.bind(this))
    .on("mouseout", handleMouseOutB.bind(this));
}

function ratioGraph(data) {
  ratiThresHold = d3
    .scaleThreshold()
    .domain([0.0001, 0.01, 0.05, 0.5, 2, 12])
    .range(["#000000", "#f0f7da", "#b9caa7", "#869f77", "#53744a", "#234d20"]);

  mapPath = graph
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", geoGenerator)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("class", "pointer")
    .attr("fill", d => ratiThresHold(d.properties.elec_produce_ratio));

  mapPath
    .on("mouseover", handleMouseOverC.bind(this))
    .on("mouseout", handleMouseOutC.bind(this));
}

function handleMouseOverA(d, i, n) {
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
      content += `<div>${d.properties.solar_electricity} mWh/y</div></div>`;
      return content;
    });
}

function handleMouseOutA(d, i, n) {
  d3.select(n[i]).attr("fill", d =>
    elecThresHold(d.properties.solar_electricity)
  );

  d3.select(`#t-${d.properties.land_area_sq_km}-${i}`).remove();
}

function handleMouseOverB(d, i, n) {
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
      content += `<div>${Math.round(
        d.properties.annual_sunlight_radiation
      )} mWh/y</div></div>`;
      return content;
    });
}

function handleMouseOutB(d, i, n) {
  d3.select(n[i]).attr("fill", d =>
    poteThresHold(d.properties.annual_sunlight_radiation)
  );

  d3.select(`#t-${d.properties.land_area_sq_km}-${i}`).remove();
}

function handleMouseOverC(d, i, n) {
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
      content += `<div>${d.properties.elec_produce_ratio}</div></div>`;
      return content;
    });
}

function handleMouseOutC(d, i, n) {
  d3.select(n[i]).attr("fill", d =>
    ratiThresHold(d.properties.elec_produce_ratio)
  );

  d3.select(`#t-${d.properties.land_area_sq_km}-${i}`).remove();
}

function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

  d3.select(window).on(`resize.${container.attr("id")}`, resize);

  function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth - 30);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}

responsivefy(svg);
