import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  Search, X, ChevronRight, Layers, ZoomIn, ZoomOut,
  Maximize2, Tag, Link2, FileText,
} from "lucide-react";
import familyData from "../imports/family.json";

import img1 from "../imports/2-DUDES.jpg";
import img2 from "../imports/2GIRLS.jpg";
import img3 from "../imports/2GIRLS008.jpg";
import img4 from "../imports/2GUYS.jpg";
import img5 from "../imports/3GIRLS.jpg";
import img6 from "../imports/3GUYS.jpg";
import img7 from "../imports/AIRSHOW.jpg";
import img8 from "../imports/AMANDA.jpg";
import img9 from "../imports/ANEXMAS.jpg";
import img10 from "../imports/ANNIEYNG.jpg";
import img11 from "../imports/ATALIE.jpg";
import img12 from "../imports/B_B.jpg";
import img13 from "../imports/BABY-1.jpg";
import img14 from "../imports/BABYGEAN.jpg";
import img15 from "../imports/BACH.jpg";
import img16 from "../imports/BEAN_GLO.jpg";
import img17 from "../imports/BEAN_GLO012.jpg";
import img18 from "../imports/BEAN.jpg";
import img19 from "../imports/BEAN2.jpg";
import img20 from "../imports/BEANIE.jpg";
import img21 from "../imports/BLU.jpg";
import img22 from "../imports/BLU014.jpg";
import img23 from "../imports/BLU017.jpg";
import img24 from "../imports/BOY.jpg";
import img25 from "../imports/BOYFLAG.jpg";
import img26 from "../imports/BROTHERS.jpg";
import img27 from "../imports/CAARDR.jpg";
import img28 from "../imports/CAARDR009.jpg";
import img29 from "../imports/CAARDR016.jpg";
import img30 from "../imports/CAKE.jpg";
import img31 from "../imports/CAPITOL.jpg";
import img32 from "../imports/CAR.jpg";
import img33 from "../imports/CEREMONY.jpg";
import img34 from "../imports/CHICK47.jpg";
import img35 from "../imports/CONFRM.jpg";
import img36 from "../imports/COUPLE.jpg";
import img37 from "../imports/COUSINS.jpg";
import img38 from "../imports/DALL.jpg";
import img39 from "../imports/DEANBR_1.jpg";
import img40 from "../imports/DOUG.jpg";
import img41 from "../imports/WILFAM.jpg";
import img42 from "../imports/WNBOFC.jpg";
import img43 from "../imports/WNBROO_1.jpg";
import img44 from "../imports/WNBROOK.jpg";
import img45 from "../imports/WOM_KIDS.jpg";
import img46 from "../imports/YNGGSA.jpg";
import img47 from "../imports/SHLVCHR.jpg";
import img48 from "../imports/STER.jpg";
import img49 from "../imports/STERLING.jpg";
import img50 from "../imports/STU_GLO.jpg";
import img51 from "../imports/TJMB.jpg";
import img52 from "../imports/TL-BETTY.jpg";
import img53 from "../imports/TL-BETTY013.jpg";
import img54 from "../imports/TL-BETTY018.jpg";
import img55 from "../imports/TRACK.jpg";
import img56 from "../imports/VICKI.jpg";

const IMAGE_URLS = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30,
  img31, img32, img33, img34, img35, img36, img37, img38, img39, img40,
  img41, img42, img43, img44, img45, img46, img47, img48, img49, img50,
  img51, img52, img53, img54, img55, img56
];
let loadedImages: HTMLImageElement[] = [];

if (typeof window !== "undefined") {
  loadedImages = IMAGE_URLS.map(url => {
    const img = new Image();
    img.src = url;
    return img;
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Group = "verified" | "unverified" | "unnamed" | "technology" | "philosophy" | "science";

interface NodeData {
  id: string;
  label: string;
  group: Group;
  excerpt: string;
  tags: string[];
}

interface EdgeData { source: string; target: string; }

interface SimNode extends NodeData {
  x: number; y: number; vx: number; vy: number; degree: number;
}

// ── Palette ───────────────────────────────────────────────────────────────────

const GROUP_COLORS: Record<Group, string> = {
  verified: "#34d399",
  unverified: "#60a5fa",
  unnamed: "#a78bfa",
  technology: "#f472b6",
  philosophy: "#fb923c",
  science: "#fcd34d",
};

const GROUP_LABELS: Record<Group, string> = {
  verified: "Verified",
  unverified: "Unverified",
  unnamed:  "Unnamed",
  technology: "Technology",
  philosophy: "Project",
  science: "Science",
};

// ── Graph data ────────────────────────────────────────────────────────────────

const RESUME_NODES: NodeData[] = [
  { id: "sterling-atkinson", label: "Sterling Atkinson", group: "verified", excerpt: "Full-Stack Software Engineer & AI Solutions Architect\n\nSpecializing in multi-agent architectures, serverless web platforms, and decentralized inference infrastructure.", tags: ["engineer", "architect"] },
  { id: "skill-nextjs", label: "Next.js & Frontend", group: "technology", excerpt: "Next.js 15, Tailwind CSS 4.0, Framer Motion, Web Audio API, TypeScript.", tags: ["frontend", "react"] },
  { id: "skill-python", label: "Python & Backend", group: "technology", excerpt: "FastAPI, Supabase, Node.js, UDP-to-MIDI routing.", tags: ["backend", "api"] },
  { id: "skill-ai", label: "AI & Machine Learning", group: "technology", excerpt: "OpenAI API, Vercel AI SDK, ChromaDB, Random Forest, Librosa.", tags: ["ai", "llm"] },
  { id: "skill-devops", label: "DevOps & Infra", group: "technology", excerpt: "K3s Kubernetes, static Netplan routing, local enterprise server clusters.", tags: ["devops", "infrastructure"] },
  { id: "proj-alic3x", label: "Alic3x Pro", group: "philosophy", excerpt: "Real-time voice assistant app for pro-audio workflows using Librosa and OpenAI.", tags: ["project", "audio", "ai"] },
  { id: "proj-iron-circle", label: "Iron Circle Cluster", group: "philosophy", excerpt: "3-node local Ubuntu server cluster on T110 hardware for local AI model inference.", tags: ["project", "cluster", "k3s"] },
  { id: "proj-model-citizen", label: "Model Citizen: Vice Grid", group: "philosophy", excerpt: "Open-world urban sandbox strategy dashboard prototype in Next.js 15.", tags: ["project", "game", "frontend"] },
  { id: "proj-openclaw", label: "OpenClaw & Agents", group: "philosophy", excerpt: "Local ChromaDB setup for long-term multi-agent temporal workflows.", tags: ["project", "agents", "memory"] },
  { id: "proj-sms", label: "SMS Extract Toolkit", group: "philosophy", excerpt: "Forensic-grade data extraction dashboard for chain-of-custody logs.", tags: ["project", "forensics"] },
  { id: "proj-randotree", label: "Randotree Predictor", group: "philosophy", excerpt: "Predictive ML pipeline utilizing Random Forest regression for market trends.", tags: ["project", "ml"] }
];

const RESUME_EDGES: EdgeData[] = [
  { source: "sterling-atkinson", target: "skill-nextjs" },
  { source: "sterling-atkinson", target: "skill-python" },
  { source: "sterling-atkinson", target: "skill-ai" },
  { source: "sterling-atkinson", target: "skill-devops" },
  { source: "sterling-atkinson", target: "proj-alic3x" },
  { source: "sterling-atkinson", target: "proj-iron-circle" },
  { source: "sterling-atkinson", target: "proj-model-citizen" },
  { source: "sterling-atkinson", target: "proj-openclaw" },
  { source: "sterling-atkinson", target: "proj-sms" },
  { source: "sterling-atkinson", target: "proj-randotree" },
  { source: "proj-alic3x", target: "skill-nextjs" },
  { source: "proj-alic3x", target: "skill-python" },
  { source: "proj-alic3x", target: "skill-ai" },
  { source: "proj-iron-circle", target: "skill-devops" },
  { source: "proj-iron-circle", target: "skill-python" },
  { source: "proj-model-citizen", target: "skill-nextjs" },
  { source: "proj-openclaw", target: "skill-python" },
  { source: "proj-openclaw", target: "skill-ai" },
  { source: "proj-sms", target: "skill-nextjs" },
  { source: "proj-randotree", target: "skill-python" },
  { source: "proj-randotree", target: "skill-ai" }
];

const NODES: NodeData[] = [...familyData.people.map((p: any) => {
  let group: Group = "unverified";
  if (p.unnamed) group = "unnamed";
  else if (p.verified) group = "verified";

  let excerpt = p.name;
  if (p.birthDate || p.deathDate) {
    excerpt += ` (${p.birthDate ? p.birthDate.substring(0, 4) : "?"} - ${p.deathDate ? p.deathDate.substring(0, 4) : "?"})`;
  }
  if (p.events && p.events.length > 0) {
    excerpt += "\n\n" + p.events.map((e: any) => e.details || e.type).join("\n• ");
  }

  const tags = [];
  if (p.sex) tags.push(p.sex.toLowerCase());
  tags.push(p.verified ? "verified" : "unverified");
  if (p.unnamed) tags.push("unnamed");

  return {
    id: p.id,
    label: p.name,
    group,
    excerpt,
    tags,
  };
}), ...RESUME_NODES];

const EDGES: EdgeData[] = [...familyData.relationships.map((r: any) => ({
  source: r.from,
  target: r.to,
})), ...RESUME_EDGES];

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function baseRadius(degree: number): number {
  return Math.max(4, Math.min(14, 4 + degree * 0.95));
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const animRef    = useRef<number>(0);
  const nodesRef   = useRef<SimNode[]>([]);
  const tickRef    = useRef(0);
  const camRef     = useRef({ x: 0, y: 0, zoom: 1 });
  const dragRef    = useRef({
    active:  false,
    nodeId:  null as string | null,
    startX:  0, startY: 0,
    lastX:   0, lastY:  0,
    moved:   false,
  });

  const [selectedNode,  setSelectedNode]  = useState<SimNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [mousePos,      setMousePos]      = useState({ x: 0, y: 0 });
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeGroups,  setActiveGroups]  = useState<Set<Group>>(
    new Set(Object.keys(GROUP_COLORS) as Group[])
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panning,     setPanning]     = useState(false);

  // Refs for canvas closure (avoid stale state)
  const selectedIdRef   = useRef<string | null>(null);
  const hoveredIdRef    = useRef<string | null>(null);
  const activeGroupsRef = useRef(activeGroups);
  const searchRef       = useRef(searchQuery);

  useEffect(() => { selectedIdRef.current   = selectedNode?.id ?? null; }, [selectedNode]);
  useEffect(() => { hoveredIdRef.current    = hoveredNodeId;            }, [hoveredNodeId]);
  useEffect(() => { activeGroupsRef.current = activeGroups;             }, [activeGroups]);
  useEffect(() => { searchRef.current       = searchQuery;              }, [searchQuery]);

  // Init simulation nodes
  useEffect(() => {
    const deg: Record<string, number> = {};
    EDGES.forEach(e => {
      deg[e.source] = (deg[e.source] || 0) + 1;
      deg[e.target] = (deg[e.target] || 0) + 1;
    });
    nodesRef.current = NODES.map(n => ({
      ...n,
      x: (Math.random() - 0.5) * 450,
      y: (Math.random() - 0.5) * 450,
      vx: 0, vy: 0,
      degree: deg[n.id] || 0,
    }));
  }, []);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setup();
    window.addEventListener("resize", setup);

    const nodeMap = new Map<string, SimNode>();

    const frame = () => {
      const nodes = nodesRef.current;
      nodes.forEach(n => nodeMap.set(n.id, n));

      const W   = canvas.offsetWidth;
      const H   = canvas.offsetHeight;
      const cam = camRef.current;
      const t   = tickRef.current;
      const temp = Math.max(0, 1 - t / 380);

      // ── Simulation ──────────────────────────────────────────────────────
      {
        const REPULSION  = 3800 * (temp * 0.7 + 0.3);
        const ATTRACTION = 0.032 * (temp * 0.5 + 0.5);
        const DAMPING    = 0.84;
        const CENTER     = 0.005;

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const d2 = dx * dx + dy * dy + 0.01;
            const d  = Math.sqrt(d2);
            const f  = REPULSION / d2;
            nodes[i].vx -= f * dx / d;
            nodes[i].vy -= f * dy / d;
            nodes[j].vx += f * dx / d;
            nodes[j].vy += f * dy / d;
          }
        }

        EDGES.forEach(({ source, target }) => {
          const a = nodeMap.get(source);
          const b = nodeMap.get(target);
          if (!a || !b) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          a.vx += dx * ATTRACTION;
          a.vy += dy * ATTRACTION;
          b.vx -= dx * ATTRACTION;
          b.vy -= dy * ATTRACTION;
        });

        nodes.forEach(n => {
          n.vx -= n.x * CENTER;
          n.vy -= n.y * CENTER;
        });

        nodes.forEach(n => {
          if (dragRef.current.nodeId === n.id) return;
          n.vx *= DAMPING;
          n.vy *= DAMPING;
          n.x  += n.vx;
          n.y  += n.vy;
        });
        tickRef.current++;
      }

      // ── Draw background ─────────────────────────────────────────────────
      ctx.fillStyle = "#0d0d14";
      ctx.fillRect(0, 0, W, H);

      // Dot grid
      const gs  = 26 * cam.zoom;
      const gox = ((cam.x % gs) + gs) % gs;
      const goy = ((cam.y % gs) + gs) % gs;
      ctx.fillStyle = "rgba(255,255,255,0.027)";
      for (let gx = gox; gx < W; gx += gs) {
        for (let gy = goy; gy < H; gy += gs) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Centre ambient glow
      const ox = W / 2 + cam.x;
      const oy = H / 2 + cam.y;
      const ag = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.max(W, H) * 0.5);
      ag.addColorStop(0, "rgba(120,90,210,0.055)");
      ag.addColorStop(1, "rgba(120,90,210,0)");
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, W, H);

      const toScreen = (x: number, y: number) => ({
        sx: x * cam.zoom + W / 2 + cam.x,
        sy: y * cam.zoom + H / 2 + cam.y,
      });

      const selId   = selectedIdRef.current;
      const hovId   = hoveredIdRef.current;
      const groups  = activeGroupsRef.current;
      const query   = searchRef.current.toLowerCase();

      const visIds = new Set(
        nodes
          .filter(n => groups.has(n.group))
          .filter(n => !query || n.label.toLowerCase().includes(query))
          .map(n => n.id)
      );

      const connToSel = new Set<string>();
      if (selId) {
        EDGES.forEach(e => {
          if (e.source === selId) connToSel.add(e.target);
          if (e.target === selId) connToSel.add(e.source);
        });
      }

      // ── Edges ───────────────────────────────────────────────────────────
      EDGES.forEach(({ source, target }) => {
        const a = nodeMap.get(source);
        const b = nodeMap.get(target);
        if (!a || !b) return;
        const { sx: ax, sy: ay } = toScreen(a.x, a.y);
        const { sx: bx, sy: by } = toScreen(b.x, b.y);

        const aVis = visIds.has(a.id);
        const bVis = visIds.has(b.id);
        const isSelEdge = selId && (source === selId || target === selId);
        const isHovEdge = hovId && (source === hovId || target === hovId);

        if (!aVis || !bVis) {
          ctx.strokeStyle = "rgba(255,255,255,0.018)";
          ctx.lineWidth   = 0.4;
        } else if (isSelEdge) {
          ctx.strokeStyle = hexToRgba(GROUP_COLORS[a.group], 0.7);
          ctx.lineWidth   = 1.6;
        } else if (isHovEdge) {
          ctx.strokeStyle = "rgba(255,255,255,0.30)";
          ctx.lineWidth   = 1.1;
        } else if (selId) {
          ctx.strokeStyle = "rgba(255,255,255,0.03)";
          ctx.lineWidth   = 0.5;
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.09)";
          ctx.lineWidth   = 0.8;
        }

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      });

      // ── Nodes ───────────────────────────────────────────────────────────
      nodes.forEach(n => {
        const { sx, sy } = toScreen(n.x, n.y);
        const r     = baseRadius(n.degree) * cam.zoom;
        const color = GROUP_COLORS[n.group];
        const vis   = visIds.has(n.id);
        const isSel = n.id === selId;
        const isHov = n.id === hovId;
        const isConn = connToSel.has(n.id);
        const isDim  = !!(selId && !isSel && !isConn);

        if (!vis) {
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(1.5, r * 0.38), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.04)";
          ctx.fill();
          return;
        }

        // Glow
        const glowR = r * (isSel ? 4.2 : isHov ? 3.2 : isConn ? 2.8 : 2.2);
        const glowA = isSel ? 0.5 : isHov ? 0.35 : isDim ? 0.04 : 0.18;
        const grd = ctx.createRadialGradient(sx, sy, r * 0.25, sx, sy, glowR);
        grd.addColorStop(0, hexToRgba(color, glowA));
        grd.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Body
        const fillA = isSel ? 1 : isHov ? 0.95 : isDim ? 0.22 : 0.82;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, fillA);
        ctx.fill();

        // Image
        // Use node id to pick a consistent image, or just only nodes that have some condition.
        // For now, randomly map nodes to the 10 images based on their id string length + char code.
        const idHash = n.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hasImage = n.group !== "unnamed" && idHash % 3 === 0; // ~33% of named nodes have an image
        if (hasImage && loadedImages.length > 0) {
          const img = loadedImages[idHash % loadedImages.length];
          if (img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(sx, sy, r * 0.88, 0, Math.PI * 2);
            ctx.clip();
            ctx.globalAlpha = isDim ? 0.22 : 1;
            ctx.drawImage(img, sx - r, sy - r, r * 2, r * 2);
            ctx.restore();
          }
        }

        if (isSel) {
          ctx.strokeStyle = "rgba(255,255,255,0.88)";
          ctx.lineWidth   = 1.6;
          ctx.stroke();
        }

        // Label
        if ((cam.zoom > 0.6 && !isDim) || isSel || isHov) {
          const fs = Math.max(9, Math.min(12, 10.5 * cam.zoom));
          ctx.font      = `${fs}px "DM Mono", monospace`;
          ctx.textAlign = "center";
          ctx.fillStyle = isSel || isHov
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.52)";
          ctx.fillText(n.label, sx, sy + r + 13);
        }
      });

      animRef.current = requestAnimationFrame(frame);
    };

    animRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", setup);
    };
  }, []);

  // Hit test
  const getNodeAt = useCallback((cx: number, cy: number): SimNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = cx - rect.left;
    const my = cy - rect.top;
    const cam = camRef.current;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    let hit: SimNode | null = null;
    let minD = Infinity;
    nodesRef.current.forEach(n => {
      const sx = n.x * cam.zoom + W / 2 + cam.x;
      const sy = n.y * cam.zoom + H / 2 + cam.y;
      const r  = baseRadius(n.degree) * cam.zoom + 6;
      const d  = Math.hypot(mx - sx, my - sy);
      if (d < r && d < minD) { minD = d; hit = n; }
    });
    return hit;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const node = getNodeAt(e.clientX, e.clientY);
    dragRef.current = {
      active: true, nodeId: node?.id ?? null,
      startX: e.clientX, startY: e.clientY,
      lastX:  e.clientX, lastY:  e.clientY,
      moved:  false,
    };
    setPanning(!node);
  }, [getNodeAt]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const drag = dragRef.current;
    setMousePos({ x: e.clientX, y: e.clientY });

    if (drag.active) {
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      if (Math.abs(e.clientX - drag.startX) > 3 || Math.abs(e.clientY - drag.startY) > 3) {
        drag.moved = true;
      }
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;

      if (drag.nodeId) {
        const node = nodesRef.current.find(n => n.id === drag.nodeId);
        if (node) {
          node.x += dx / camRef.current.zoom;
          node.y += dy / camRef.current.zoom;
          node.vx = 0; node.vy = 0;
        }
      } else {
        camRef.current.x += dx;
        camRef.current.y += dy;
      }
    } else {
      const node = getNodeAt(e.clientX, e.clientY);
      setHoveredNodeId(node?.id ?? null);
    }
  }, [getNodeAt]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const drag = dragRef.current;
    if (!drag.moved && drag.nodeId) {
      const node = nodesRef.current.find(n => n.id === drag.nodeId);
      if (node) { setSelectedNode(node); setSidebarOpen(true); }
    } else if (!drag.moved) {
      setSelectedNode(null); setSidebarOpen(false);
    }
    dragRef.current.active = false;
    dragRef.current.nodeId = null;
    setPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect  = canvas.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;
    const W     = canvas.offsetWidth;
    const H     = canvas.offsetHeight;
    const cam   = camRef.current;
    const factor  = e.deltaY > 0 ? 0.91 : 1.10;
    const newZoom = Math.max(0.12, Math.min(4, cam.zoom * factor));
    const ratio   = newZoom / cam.zoom;
    cam.x = (mx - W / 2) * (1 - ratio) + cam.x * ratio;
    cam.y = (my - H / 2) * (1 - ratio) + cam.y * ratio;
    cam.zoom = newZoom;
  }, []);

  // Sidebar data
  const connectedNodes = useMemo((): NodeData[] => {
    if (!selectedNode) return [];
    const ids = new Set<string>();
    EDGES.forEach(e => {
      if (e.source === selectedNode.id) ids.add(e.target);
      if (e.target === selectedNode.id) ids.add(e.source);
    });
    return Array.from(ids)
      .map(id => NODES.find(n => n.id === id))
      .filter(Boolean) as NodeData[];
  }, [selectedNode]);

  const selectNode = (id: string) => {
    const node = nodesRef.current.find(n => n.id === id);
    if (node) setSelectedNode(node);
  };

  const toggleGroup = (g: Group) => {
    setActiveGroups(prev => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g); else next.add(g);
      return next;
    });
  };

  // Tooltip position (computed from node world pos + cam)
  const tooltipNode = useMemo(() => {
    if (!hoveredNodeId) return null;
    const node   = nodesRef.current.find(n => n.id === hoveredNodeId);
    const canvas = canvasRef.current;
    if (!node || !canvas) return null;
    const cam = camRef.current;
    const W   = canvas.offsetWidth;
    const H   = canvas.offsetHeight;
    return {
      node,
      sx: node.x * cam.zoom + W / 2 + cam.x,
      sy: node.y * cam.zoom + H / 2 + cam.y - baseRadius(node.degree) * cam.zoom - 10,
    };
  }, [hoveredNodeId, mousePos]); // mousePos triggers recompute each frame

  const cursor = panning
    ? "grabbing"
    : hoveredNodeId ? "pointer" : "grab";

  return (
    <div
      className="w-full h-screen bg-[#0d0d14] flex flex-col overflow-hidden select-none"
      style={{ fontFamily: '"DM Mono", monospace' }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 h-10 border-b border-white/[0.055] bg-[#0d0d14]/95 backdrop-blur-sm flex-shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center shadow-[0_0_12px_rgba(167,139,250,0.4)]">
            <Layers size={9} className="text-white" />
          </div>
          <span className="text-[10px] text-white/35 tracking-[0.2em] uppercase">Knowledge Graph</span>
        </div>

        <div className="w-px h-3.5 bg-white/10 mx-0.5" />

        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/22" />
          <input
            className="bg-white/[0.035] border border-white/[0.07] rounded-lg text-[11px] text-white/72 pl-7 pr-7 py-1.5 w-48
                       focus:outline-none focus:border-violet-500/45 focus:bg-white/[0.055] placeholder-white/18 transition-colors"
            placeholder="Filter nodes…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/50 transition-colors"
            >
              <X size={10} />
            </button>
          )}
        </div>

        <div className="flex-1" />
        <span className="text-[10px] text-white/18 tabular-nums">
          {NODES.length} nodes · {EDGES.length} links
        </span>
      </header>

      {/* ── Canvas wrapper ──────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ cursor }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setHoveredNodeId(null);
            dragRef.current.active = false;
            setPanning(false);
          }}
          onWheel={handleWheel}
        />

        {/* ── Left panel: groups + zoom ──────────────────────────────────── */}
        <aside className="absolute left-3 top-3 flex flex-col gap-2 pointer-events-auto">
          <div className="bg-[#111120]/88 backdrop-blur-xl border border-white/[0.065] rounded-xl p-3 w-[170px]">
            <p className="text-[9px] text-white/22 uppercase tracking-[0.22em] mb-2.5">Groups</p>
            <div className="flex flex-col gap-0.5">
              {(Object.keys(GROUP_COLORS) as Group[]).map(g => {
                const on = activeGroups.has(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGroup(g)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.045] transition-colors w-full text-left"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{
                        backgroundColor: GROUP_COLORS[g],
                        opacity: on ? 1 : 0.14,
                        boxShadow: on ? `0 0 7px ${GROUP_COLORS[g]}90` : "none",
                      }}
                    />
                    <span
                      className="text-[10px] transition-colors duration-200"
                      style={{ color: on ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.18)" }}
                    >
                      {GROUP_LABELS[g]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#111120]/88 backdrop-blur-xl border border-white/[0.065] rounded-xl overflow-hidden">
            {([
              [ZoomIn,    () => { camRef.current.zoom = Math.min(4, camRef.current.zoom * 1.3); }],
              [ZoomOut,   () => { camRef.current.zoom = Math.max(0.12, camRef.current.zoom * 0.77); }],
              [Maximize2, () => { camRef.current = { x: 0, y: 0, zoom: 1 }; }],
            ] as const).map(([Icon, action], i) => (
              <button
                key={i}
                onClick={() => action()}
                className={`flex items-center justify-center w-full h-9 hover:bg-white/[0.05] transition-colors ${i < 2 ? "border-b border-white/[0.055]" : ""}`}
              >
                <Icon size={12} className="text-white/32" />
              </button>
            ))}
          </div>
        </aside>

        {/* ── Hover tooltip ──────────────────────────────────────────────── */}
        {tooltipNode && !panning && (
          <div
            className="absolute pointer-events-none z-20"
            style={{
              left:      tooltipNode.sx,
              top:       tooltipNode.sy,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-[#1b1b2e]/98 border border-white/[0.11] rounded-lg px-3 py-2 flex items-center gap-2 whitespace-nowrap shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: GROUP_COLORS[tooltipNode.node.group],
                  boxShadow: `0 0 6px ${GROUP_COLORS[tooltipNode.node.group]}`,
                }}
              />
              <span className="text-[11px] text-white/80">{tooltipNode.node.label}</span>
              <span
                className="text-[9px] ml-0.5"
                style={{ color: GROUP_COLORS[tooltipNode.node.group] }}
              >
                {GROUP_LABELS[tooltipNode.node.group]}
              </span>
            </div>
          </div>
        )}

        {/* ── Right sidebar ──────────────────────────────────────────────── */}
        <aside
          className="absolute right-0 top-0 h-full w-[276px] flex flex-col bg-[#0f0f1c]/97 backdrop-blur-2xl border-l border-white/[0.055] transition-transform duration-300 ease-out z-10"
          style={{ transform: sidebarOpen && selectedNode ? "translateX(0)" : "translateX(100%)" }}
        >
          {selectedNode && (
            <>
              {/* Header */}
              <div className="px-4 pt-4 pb-3 flex-shrink-0">
                <div className="flex items-start justify-between mb-0.5">
                  <span
                    className="text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: GROUP_COLORS[selectedNode.group] }}
                  >
                    {GROUP_LABELS[selectedNode.group]}
                  </span>
                  <button
                    onClick={() => { setSidebarOpen(false); setSelectedNode(null); }}
                    className="text-white/18 hover:text-white/50 transition-colors -mt-0.5 -mr-0.5"
                  >
                    <X size={13} />
                  </button>
                </div>
                <h2 className="text-white text-[13.5px] font-medium leading-snug mb-3">
                  {selectedNode.label}
                </h2>
                <div
                  className="h-px"
                  style={{ background: `linear-gradient(to right, ${GROUP_COLORS[selectedNode.group]}55, transparent)` }}
                />
              </div>

              {/* Scrollable body */}
              <div
                className="flex-1 overflow-y-auto px-4 pb-4 space-y-4"
                style={{ scrollbarWidth: "none" }}
              >
                {/* Note excerpt */}
                <section>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FileText size={9} className="text-white/20" />
                    <span className="text-[9px] text-white/22 uppercase tracking-[0.18em]">Note</span>
                  </div>
                  <p className="text-[11px] text-white/48 leading-[1.7] whitespace-pre-wrap">{selectedNode.excerpt}</p>
                </section>

                {/* Tags */}
                <section>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Tag size={9} className="text-white/20" />
                    <span className="text-[9px] text-white/22 uppercase tracking-[0.18em]">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] px-2 py-0.5 rounded-full border border-white/[0.09] text-white/32"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Linked nodes */}
                <section>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Link2 size={9} className="text-white/20" />
                    <span className="text-[9px] text-white/22 uppercase tracking-[0.18em]">
                      Linked · {connectedNodes.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {connectedNodes.map(n => (
                      <button
                        key={n.id}
                        onClick={() => selectNode(n.id)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors text-left group w-full"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: GROUP_COLORS[n.group] }}
                        />
                        <span className="text-[11px] text-white/42 group-hover:text-white/75 transition-colors flex-1 truncate">
                          {n.label}
                        </span>
                        <ChevronRight size={9} className="text-white/14 group-hover:text-white/38 transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/[0.048] flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-white/20">Connections</span>
                  <span
                    className="text-[11px] tabular-nums"
                    style={{ color: GROUP_COLORS[selectedNode.group] }}
                  >
                    {selectedNode.degree}
                  </span>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ── Bottom status bar ──────────────────────────────────────────── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-[#111120]/75 backdrop-blur-xl border border-white/[0.06] rounded-full px-3.5 py-1.5 flex items-center gap-3">
            <span className="text-[9px] text-white/25 tracking-[0.15em]">SCROLL TO ZOOM</span>
            <div className="w-px h-2.5 bg-white/10" />
            <span className="text-[9px] text-white/25 tracking-[0.15em]">DRAG TO PAN</span>
            <div className="w-px h-2.5 bg-white/10" />
            <span className="text-[9px] text-white/25 tracking-[0.15em]">CLICK NODE TO INSPECT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
