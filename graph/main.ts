import dagreD3 from 'dagre-d3';
import * as d3 from 'd3'

async function buildGraph1() {
    const g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel((function() { return {}; }));

    g.setNode("pa", { label: 'Pickup A' });
    g.setNode("pb", { label: 'Pickup B' });
    g.setNode("da", { label: 'Delivery A' });
    g.setNode("db", { label: 'Delivery B' });
    g.setEdge("pa", "pb");
    g.setEdge("pb", "db");
    g.setEdge("pa", "da");
    g.setEdge("da", "db");
    g.setEdge("db", "pa");

    g.nodes().forEach(function(v) {
        var node = g.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
      });

    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("#svg1"),
    svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("#svg1 g") as any, g);

    // Center the graph
    var xCenterOffset = (parseInt(svg.attr("width"), 10) - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);

}

buildGraph1();

