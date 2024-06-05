import { useEffect, useRef, useState, Dispatch, SetStateAction} from "react";
import * as d3 from "d3";
import { TreeNodeToolTip } from "./TreeNodeToolTip";

type TreeNodeData = {
  name: string;
  type: "user" | "project" | "task" | "commit";
  id?: string;
  children?: TreeNodeData[];
};


type TooltipState = {
  id: string | undefined;
  type?: "user" | "project" | "task" | "commit";
  top: number;
  left: number;
  visible: boolean;
};

export const TreeChart = ({ data, isLoading }) => {

  const ref = useRef<HTMLDivElement>(null);
  const [pinnedNode, setPinnedNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    id: '',
    top: 0,
    left: 0,
    visible: false
  });


  useEffect(() => {
    
    // Manejador del evento "click" en el cuerpo
    const handleBodyClick = () => {
      if (pinnedNode) {
        setPinnedNode(null);
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };
    
    document.body.addEventListener('click', handleBodyClick);
    
    // Limpieza: remover el manejador cuando el componente se desmonte
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [data, tooltip, pinnedNode]);


  useEffect(() => {
    renderChart(data, ref.current, setTooltip, tooltip, pinnedNode, setPinnedNode);
  }, [data, tooltip, pinnedNode]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }}>
            <TreeNodeToolTip data={data} id={tooltip.id} position={{ top: tooltip.top, left: tooltip.left }} visible={tooltip.visible} type={ tooltip.type } />
          </div>
};




const getNodeColor = (d: d3.HierarchyNode<TreeNodeData>): string => {
  if (d.data.name.startsWith("user")) return "black";
  if (d.data.name.startsWith("project")) return "#abc4ff";
  if (d.data.name.startsWith("layer")) return "#ff82a9";
  if (d.data.status === 'pending') return "#FE0000";
  if (d.data.status === 'approval') return "#FFD700";
  if (d.data.status === 'completed') return "#0000B8";
  if (d.data.name.startsWith("repo")) return "#52b788";
  if (d.data.name.startsWith("commit")) return "#ffafcc";
  return "black";
};




const renderChart = (
  data: TreeNodeData, 
  container: HTMLDivElement | null, 
  setTooltip: Dispatch<SetStateAction<TooltipState>>, 
  tooltip: TooltipState, 
  pinnedNode: string | null, 
  setPinnedNode: Dispatch<SetStateAction<string | null>>
) => {
  

  if (!container) return;

  // Verifica si ya hay un SVG en el contenedor.
  // Si no hay un SVG, crea uno.
  if (!d3.select(container).select("svg").node()) {
    d3.select(container).append("svg");
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 3])
    .on("zoom", (event) => {
      svg.select<SVGGElement>("g").attr("transform", event.transform);
    });
    
  const svg = d3.select(container).select<SVGSVGElement>("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .on("mousedown", () => {
      // Ocultar el tooltip cuando se haga clic en el SVG
      if (tooltip.visible) {
        setTooltip({ ...tooltip, visible: false });
      }
    });

  if (tooltip.visible) {
    svg.on(".zoom", null); // Desactivar el zoom
  } else {
    svg.call(zoom); // Activar el zoom
  }

  const g = svg.selectAll<SVGGElement, unknown>("g")
    .data([null])
    .join("g");

  const root = d3.hierarchy(data) as d3.HierarchyPointNode<TreeNodeData>;
  const clusterLayout = d3.cluster<TreeNodeData>().size([height, width]);
  clusterLayout(root);

  const rootX = root.x;
  const centerY = height / 2;
  const offsetY = centerY - rootX;

  const linkFunc = d3.linkHorizontal()
    .x(d => d[0])
    .y(d => d[1]);

  const transformedLinks = root.links().map(link => ({
    source: [(link.source as d3.HierarchyPointNode<TreeNodeData>).y, (link.source as d3.HierarchyPointNode<TreeNodeData>).x] as [number, number],
    target: [(link.target as d3.HierarchyPointNode<TreeNodeData>).y, (link.target as d3.HierarchyPointNode<TreeNodeData>).x] as [number, number]
  }));

  if (!g.attr("data-initialized")) {
    g.attr("transform", `translate(20, ${offsetY})`);
    g.attr("data-initialized", "true");
  }

  // Render links
  g.selectAll(".link")
    .data(transformedLinks)
    .join("path")
    .attr("class", "link")
    .attr("d", d => linkFunc({ source: d.source, target: d.target }))
    .attr("stroke", "black")
    .attr("fill", "none");

  // Render nodes
  g.selectAll(".node")
    .data(root.descendants())
    .join("circle")
    .attr("class", "node")
    .attr("r", 5)
    .attr("cx", d => d.y)
    .attr("cy", d => d.x)
    .attr("fill", getNodeColor)
    .on("mouseenter", (event, d) => {
      event.preventDefault();
      // Mostrar el tooltip solo si no hay un tooltip anclado (pinnedNode es null)
      if (!pinnedNode) {
        setTooltip({
          type: d.data.type,
          id: d.data.id,
          top: event.clientY,
          left: event.clientX,
          visible: true
        });
      }
    })
    .on("mouseleave", () => {
      if (!pinnedNode) {
        setTooltip({
          id: '',
          top: 0,
          left: 0,
          visible: false
        });
      }
    })
    .on("mousemove", (event) => {
      event.preventDefault();
      if (!pinnedNode) {
        setTooltip((prev) => ({
          ...prev,
          top: event.clientY + 10,
          left: event.clientX + 10
        }));
      }
    })
    .on("click", (event, d) => {
      event.stopPropagation();
      if (pinnedNode === d.data.id) {
        setPinnedNode(null);
        setTooltip({
          ...tooltip,
          visible: false
        });
      } else {
        if ( !d.data.id ) return null;
        setPinnedNode(d.data.id);
        setTooltip({
          type: d.data.type,
          id: d.data.id,
          top: event.clientY,
          left: event.clientX,
          visible: true
        });
      }
    });

  // Render labels
  g.selectAll(".label")
    .data(root.descendants())
    .join("text")
    .attr("class", "label")
    .attr("x", d => d.y - 5)
    .attr("y", d => d.x - 10)
    .text(d => d.data.name)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "10px");



};


