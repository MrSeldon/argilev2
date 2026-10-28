"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";

interface GraphNode {
  id: string;
  name: string;
  category: string;
  color: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface ConnectionsGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function ConnectionsGraph({ nodes, links }: ConnectionsGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Track container size
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        setDimensions({
          width: svgRef.current.parentElement.clientWidth,
          height: svgRef.current.parentElement.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // D3 force simulation
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Deep copy data for simulation
    const nodesCopy: GraphNode[] = nodes.map((d) => ({ ...d }));
    const linksCopy: GraphLink[] = links.map((d) => ({ ...d }));

    // Create simulation
    const simulation = d3
      .forceSimulation(nodesCopy)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(linksCopy)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create container group with zoom
    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Draw links
    const link = g
      .append("g")
      .selectAll("line")
      .data(linksCopy)
      .join("line")
      .attr("stroke", "#CBBFAB")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Draw nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodesCopy)
      .join("g")
      .attr("cursor", "pointer")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Node circles
    node
      .append("circle")
      .attr("r", 12)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#FBF8F3")
      .attr("stroke-width", 2)
      .on("click", (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      })
      .on("dblclick", (event, d) => {
        event.stopPropagation();
        router.push(`/inspirations/${d.category}/${d.id}`);
      })
      .on("mouseenter", function () {
        d3.select(this).attr("r", 16);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("r", 12);
      });

    // Node labels
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 16)
      .attr("y", 4)
      .attr("font-size", "11px")
      .attr("fill", "#4A463F")
      .attr("pointer-events", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x || 0)
        .attr("y1", (d) => (d.source as GraphNode).y || 0)
        .attr("x2", (d) => (d.target as GraphNode).x || 0)
        .attr("y2", (d) => (d.target as GraphNode).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Click on background to deselect
    svg.on("click", () => setSelectedNode(null));

    return () => {
      simulation.stop();
    };
  }, [nodes, links, dimensions]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
      />

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="absolute top-4 right-4 left-4 sm:left-auto bg-paper-soft border border-line shadow-card p-4 sm:max-w-xs animate-fade-in">
          <div className="flex items-start gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0 mt-1"
              style={{ backgroundColor: selectedNode.color }}
            />
            <div>
              <h3 className="text-heading-sm">{selectedNode.name}</h3>
              <p className="text-caption text-clay-500 capitalize mb-2">
                {selectedNode.category}
              </p>
              <a
                href={`/inspirations/${selectedNode.category}/${selectedNode.id}`}
                className="inline-flex items-center min-h-11 text-label uppercase text-ink-2 hover:text-terracotta-deep"
              >
                View details &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-caption text-clay-500">
        Drag nodes · Pinch or scroll to zoom · Tap for details
      </div>
    </div>
  );
}
