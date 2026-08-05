class AnomalyReasoner:
    def __init__(self):
        pass

    def reason(self, validation_results: dict, graph_data: dict) -> list:
        anomalies = []
        
        all_errors = validation_results.get("structural_errors", []) + validation_results.get("semantic_errors", [])

        if not all_errors:
            return [{
                "id": "ANOM_000",
                "code": "STATUS_OK",
                "title": "Diagram Structure Validated",
                "severity": "LOW",
                "confidence": 0.99,
                "reason": "The technical diagram satisfies all graph topology and flowchart semantic constraints.",
                "possible_cause": "Well-formed flow sequence.",
                "suggested_repair": "No repair required.",
                "impact_analysis": "Execution flows cleanly from START to END without dangling branches."
            }]

        for idx, err in enumerate(all_errors, 1):
            anom_id = f"ANOM_{idx:03d}"
            code = err.get("code")
            node_id = err.get("node_id", "N/A")
            desc = err.get("description")
            severity = err.get("severity", "MEDIUM")

            if code == "ERR_MISSING_START":
                anomalies.append({
                    "id": anom_id,
                    "code": code,
                    "title": "Missing Entry Flow (Start Node)",
                    "severity": severity,
                    "confidence": 0.96,
                    "reason": "Graph traversal cannot establish a deterministic entry point because no oval START symbol exists.",
                    "possible_cause": "Diagram designer omitted the initial initialization boundary or crop truncated top region.",
                    "suggested_repair": "Inject a START node at top center [X: 50%, Y: 5%] and draw directed edge to first process block.",
                    "impact_analysis": "Prevents automated interpreters from locating execution root."
                })
            elif code == "ERR_MISSING_END":
                anomalies.append({
                    "id": anom_id,
                    "code": code,
                    "title": "Unbounded Execution (Missing End Node)",
                    "severity": severity,
                    "confidence": 0.95,
                    "reason": "No terminal END symbol found in the control flow graph, allowing infinite execution state.",
                    "possible_cause": "Omitted terminal shape at diagram termination point.",
                    "suggested_repair": "Inject an END node at bottom center and connect dangling terminal branches.",
                    "impact_analysis": "Risk of unhandled hanging processes or unclosed system threads."
                })
            elif code == "ERR_DEAD_END":
                anomalies.append({
                    "id": anom_id,
                    "code": code,
                    "title": "Dead-End Block Detected",
                    "severity": severity,
                    "confidence": 0.93,
                    "reason": f"Node [{node_id}] reaches a non-terminal state without any outgoing directed transition.",
                    "possible_cause": "Missing connector arrow or broken arrow segment during diagram creation.",
                    "suggested_repair": f"Connect node [{node_id}] to the primary flow stream or terminal END block.",
                    "impact_analysis": "Traps control flow in dead-end execution state."
                })
            elif code == "ERR_UNREACHABLE":
                anomalies.append({
                    "id": anom_id,
                    "code": code,
                    "title": "Unreachable Island Node",
                    "severity": severity,
                    "confidence": 0.94,
                    "reason": f"Node [{node_id}] is isolated from the main graph topology with zero incoming edges.",
                    "possible_cause": "Dangling process symbol without incoming control arrow.",
                    "suggested_repair": f"Establish incoming arrow from preceding decision or process node to [{node_id}].",
                    "impact_analysis": "Orphaned process logic that will never be triggered."
                })
            elif code == "ERR_DECISION_BRANCH":
                anomalies.append({
                    "id": anom_id,
                    "code": code,
                    "title": "Incomplete Condition Branching",
                    "severity": severity,
                    "confidence": 0.97,
                    "reason": f"Decision block [{node_id}] evaluates a conditional expression but only provides 1 outgoing path.",
                    "possible_cause": "Missing alternative branch (e.g. missing NO path).",
                    "suggested_repair": f"Add explicit second outgoing edge with 'NO' condition label to alternate handler.",
                    "impact_analysis": "Undefined fallback behavior when boolean evaluation is false."
                })
            elif code == "ERR_MISSING_CONDITION_LABEL":
                anomalies.append({
                    "id": anom_id,
                    "code": code,
                    "title": "Unlabeled Conditional Edge",
                    "severity": severity,
                    "confidence": 0.89,
                    "reason": f"Outgoing edge from decision node [{node_id}] lacks conditional text ('YES' / 'NO').",
                    "possible_cause": "OCR missed edge label text or author omitted text on arrow.",
                    "suggested_repair": "Annotate edge with clear 'YES' or 'NO' evaluation string.",
                    "impact_analysis": "Ambiguity in execution trace evaluation."
                })

        return anomalies
