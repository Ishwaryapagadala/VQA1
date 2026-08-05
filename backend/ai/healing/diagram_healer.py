import cv2
import numpy as np
import base64
import copy

class DiagramHealer:
    def __init__(self):
        pass

    def heal(self, image_path: str, graph_data: dict, anomalies: list) -> dict:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not load image {image_path}")

        healed_graph = copy.deepcopy(graph_data)
        raw_nodes = healed_graph.get("nodes", [])
        edges = healed_graph.get("edges", [])

        # Ensure node dictionary format
        nodes = []
        for n in raw_nodes:
            if isinstance(n, dict):
                nodes.append(n)
            elif isinstance(n, tuple):
                node_id, attrs = n
                attrs["id"] = node_id
                nodes.append(attrs)

        repair_logs = []

        h, w = img.shape[:2]
        canvas = img.copy()

        overlay = np.ones((h, w, 3), dtype=np.uint8) * 245
        cv2.addWeighted(overlay, 0.4, canvas, 0.6, 0, canvas)

        # 1. Fix missing Start node
        if any(a.get("code") == "ERR_MISSING_START" for a in anomalies):
            new_start_id = "node_healed_start"
            new_start_node = {
                "id": new_start_id,
                "type": "Start",
                "text": "START (Auto-Healed)",
                "bbox": [int(w * 0.4), 20, int(w * 0.2), 45],
                "center": [int(w * 0.5), 42],
                "confidence": 1.0,
                "is_healed": True
            }
            nodes.insert(0, new_start_node)
            if len(nodes) > 1:
                first_target = nodes[1].get("id", "node_1")
                edges.insert(0, {
                    "source": new_start_id,
                    "target": first_target,
                    "label": "FLOW",
                    "confidence": 1.0,
                    "is_healed": True
                })
            repair_logs.append({
                "step": 1,
                "action": "INJECT_START_NODE",
                "details": "Inserted START boundary oval node at top center [50% W, 40px H] and routed flow edge to initial process.",
                "status": "SUCCESS"
            })

        # 2. Fix missing End node
        if any(a.get("code") == "ERR_MISSING_END" for a in anomalies):
            new_end_id = "node_healed_end"
            new_end_node = {
                "id": new_end_id,
                "type": "End",
                "text": "END (Auto-Healed)",
                "bbox": [int(w * 0.4), h - 65, int(w * 0.2), 45],
                "center": [int(w * 0.5), h - 42],
                "confidence": 1.0,
                "is_healed": True
            }
            nodes.append(new_end_node)
            for n in nodes:
                nid = n.get("id")
                if nid and nid != new_end_id:
                    out_count = sum(1 for e in edges if e.get("source") == nid)
                    if out_count == 0:
                        edges.append({
                            "source": nid,
                            "target": new_end_id,
                            "label": "FLOW",
                            "confidence": 1.0,
                            "is_healed": True
                        })
            repair_logs.append({
                "step": len(repair_logs) + 1,
                "action": "INJECT_END_NODE",
                "details": "Inserted END terminal oval node at bottom center [50% W, H-40px] and connected dangling branches.",
                "status": "SUCCESS"
            })

        # 3. Fix incomplete decision branches
        for a in anomalies:
            if a.get("code") == "ERR_DECISION_BRANCH":
                node_id = a.get("node_id")
                end_node = next((n for n in nodes if n.get("type") == "End"), nodes[-1])
                edges.append({
                    "source": node_id,
                    "target": end_node.get("id"),
                    "label": "NO (Auto-Repaired)",
                    "confidence": 0.98,
                    "is_healed": True
                })
                repair_logs.append({
                    "step": len(repair_logs) + 1,
                    "action": "ADD_DECISION_BRANCH",
                    "details": f"Added missing 'NO' condition branch from Decision [{node_id}] to Terminal [{end_node.get('id')}].",
                    "status": "SUCCESS"
                })

        # Render healed visual overlay on canvas
        for n in nodes:
            bx, by, bw, bh = n["bbox"]
            color = (34, 197, 94) if n.get("is_healed") else (139, 92, 246)
            thickness = 3 if n.get("is_healed") else 2

            if n.get("type") in ["Start", "End"]:
                cv2.ellipse(canvas, (bx + bw//2, by + bh//2), (bw//2, bh//2), 0, 0, 360, color, thickness)
            elif n.get("type") == "Decision":
                pts = np.array([[bx + bw//2, by], [bx + bw, by + bh//2], [bx + bw//2, by + bh], [bx, by + bh//2]], np.int32)
                cv2.polylines(canvas, [pts], True, color, thickness)
            else:
                cv2.rectangle(canvas, (bx, by), (bx + bw, by + bh), color, thickness)

            txt = str(n.get("text", n.get("id", "")))
            cv2.putText(canvas, txt[:20], (bx + 5, by + bh//2 + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (15, 23, 42), 1, cv2.LINE_AA)

        # Draw healed edges
        for e in edges:
            src_n = next((n for n in nodes if n.get("id") == e.get("source")), None)
            tgt_n = next((n for n in nodes if n.get("id") == e.get("target")), None)
            if src_n and tgt_n:
                pt1 = tuple(src_n["center"])
                pt2 = tuple(tgt_n["center"])
                edge_color = (16, 185, 129) if e.get("is_healed") else (59, 130, 246)
                cv2.arrowedLine(canvas, pt1, pt2, edge_color, 2, tipLength=0.03)
                if e.get("label"):
                    mid = ((pt1[0] + pt2[0]) // 2 + 10, (pt1[1] + pt2[1]) // 2)
                    cv2.putText(canvas, str(e["label"]), mid, cv2.FONT_HERSHEY_SIMPLEX, 0.4, (225, 29, 72) if e.get("is_healed") else (71, 85, 105), 1)

        healed_b64 = "data:image/png;base64," + base64.b64encode(cv2.imencode('.png', canvas)[1]).decode('utf-8')

        return {
            "healed_graph": {
                "num_nodes": len(nodes),
                "num_edges": len(edges),
                "nodes": nodes,
                "edges": edges
            },
            "repair_logs": repair_logs,
            "repaired_image": healed_b64,
            "total_repairs": len(repair_logs)
        }
