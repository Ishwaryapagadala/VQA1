class DiagramValidator:
    def __init__(self):
        pass

    def validate(self, graph_data: dict, detected_objects: list) -> dict:
        nodes = graph_data.get("nodes", [])
        edges = graph_data.get("edges", [])
        adjacency = graph_data.get("adjacency", {})

        structural_errors = []
        semantic_errors = []

        # 1. Missing Start Node
        has_start = any(n.get("type") == "Start" or "start" in str(n.get("text")).lower() for n in nodes)
        if not has_start:
            structural_errors.append({
                "code": "ERR_MISSING_START",
                "type": "Missing Start Node",
                "severity": "CRITICAL",
                "description": "The flowchart lacks an explicit START point, creating ambiguous entry flow."
            })

        # 2. Missing End Node
        has_end = any(n.get("type") == "End" or "end" in str(n.get("text")).lower() or "finish" in str(n.get("text")).lower() for n in nodes)
        if not has_end:
            structural_errors.append({
                "code": "ERR_MISSING_END",
                "type": "Missing End Node",
                "severity": "CRITICAL",
                "description": "The flowchart has no defined END termination node."
            })

        # 3. Disconnected Nodes / Dead Ends
        incoming_counts = {n.get("id"): 0 for n in nodes}
        outgoing_counts = {n.get("id"): 0 for n in nodes}

        for edge in edges:
            src = edge.get("source")
            tgt = edge.get("target")
            if src in outgoing_counts:
                outgoing_counts[src] += 1
            if tgt in incoming_counts:
                incoming_counts[tgt] += 1

        for n in nodes:
            nid = n.get("id")
            ntype = n.get("type")
            
            # Dead end (non-End node with 0 outgoing edges)
            if outgoing_counts[nid] == 0 and ntype != "End":
                structural_errors.append({
                    "code": "ERR_DEAD_END",
                    "type": "Dead End Node",
                    "severity": "HIGH",
                    "node_id": nid,
                    "description": f"Node [{nid} - {ntype}] has no outgoing connection, causing execution freeze."
                })

            # Unreachable node (non-Start node with 0 incoming edges)
            if incoming_counts[nid] == 0 and ntype != "Start":
                structural_errors.append({
                    "code": "ERR_UNREACHABLE",
                    "type": "Disconnected Node",
                    "severity": "HIGH",
                    "node_id": nid,
                    "description": f"Node [{nid} - {ntype}] cannot be reached from any predecessor."
                })

        # 4. Decision Node Semantic Validation (Must have at least 2 branches with YES/NO labels)
        for n in nodes:
            nid = n.get("id")
            if n.get("type") == "Decision":
                out_edges = [e for e in edges if e.get("source") == nid]
                if len(out_edges) < 2:
                    semantic_errors.append({
                        "code": "ERR_DECISION_BRANCH",
                        "type": "Incomplete Decision Branching",
                        "severity": "HIGH",
                        "node_id": nid,
                        "description": f"Decision node [{nid}] has only {len(out_edges)} outgoing path. Decision blocks require at least 2 paths (YES/NO)."
                    })
                
                # Check for unlabelled branches
                unlabelled = any(e.get("label") not in ["YES", "NO", "TRUE", "FALSE"] for e in out_edges)
                if unlabelled and len(out_edges) > 0:
                    semantic_errors.append({
                        "code": "ERR_MISSING_CONDITION_LABEL",
                        "type": "Missing Branch Condition Label",
                        "severity": "MEDIUM",
                        "node_id": nid,
                        "description": f"Decision node [{nid}] outgoing edge is missing explicit 'YES' or 'NO' label."
                    })

        # Summary
        is_valid = len(structural_errors) == 0 and len(semantic_errors) == 0

        return {
            "is_valid": is_valid,
            "total_errors": len(structural_errors) + len(semantic_errors),
            "structural_errors": structural_errors,
            "semantic_errors": semantic_errors
        }
