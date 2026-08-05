import networkx as nx

class GraphBuilder:
    def __init__(self):
        pass

    def build_graph(self, detected_objects: list, ocr_results: list) -> tuple:
        G = nx.DiGraph()

        nodes_dict = {}
        for obj in detected_objects:
            if obj["label"] != "Arrow":
                node_id = obj["id"]
                ocr_item = next((item for item in ocr_results if item["node_id"] == node_id), None)
                text = ocr_item["text"] if ocr_item else f"Node {node_id}"

                node_entry = {
                    "id": node_id,
                    "type": obj["label"],
                    "text": text,
                    "bbox": obj["bbox"],
                    "center": obj["center"],
                    "confidence": obj["confidence"]
                }
                nodes_dict[node_id] = node_entry
                G.add_node(node_id, **node_entry)

        sorted_nodes = sorted(nodes_dict.values(), key=lambda n: n["center"][1])

        edges = []
        for i in range(len(sorted_nodes) - 1):
            curr = sorted_nodes[i]
            nxt = sorted_nodes[i+1]

            if curr["type"] == "Decision":
                for remaining in sorted_nodes[i+1:]:
                    dy = remaining["center"][1] - curr["center"][1]
                    if 0 < dy < 300:
                        condition_label = "YES" if remaining["center"][0] < curr["center"][0] else "NO"
                        edge_entry = {
                            "source": curr["id"],
                            "target": remaining["id"],
                            "label": condition_label,
                            "confidence": 0.92
                        }
                        edges.append(edge_entry)
                        G.add_edge(curr["id"], remaining["id"], **edge_entry)
            else:
                dy = nxt["center"][1] - curr["center"][1]
                if 0 < dy < 250 and curr["type"] != "End":
                    edge_entry = {
                        "source": curr["id"],
                        "target": nxt["id"],
                        "label": "FLOW",
                        "confidence": 0.95
                    }
                    edges.append(edge_entry)
                    G.add_edge(curr["id"], nxt["id"], **edge_entry)

        graph_data = {
            "num_nodes": G.number_of_nodes(),
            "num_edges": G.number_of_edges(),
            "nodes": list(nodes_dict.values()),
            "edges": edges,
            "adjacency": {n: list(G.successors(n)) for n in G.nodes()}
        }

        return graph_data, G
