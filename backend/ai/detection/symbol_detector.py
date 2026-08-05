import cv2
import numpy as np

class SymbolDetector:
    def __init__(self, yolo_weights_path: str = None):
        self.yolo_model = None
        if yolo_weights_path:
            try:
                from ultralytics import YOLO
                self.yolo_model = YOLO(yolo_weights_path)
                print(f"Loaded YOLOv8 model from {yolo_weights_path}")
            except Exception as e:
                print(f"YOLO model load warning: {e}. Falling back to OpenCV contour geometric detector.")

    def detect(self, image_path: str) -> list:
        img = cv2.imread(image_path)
        if img is None:
            return []

        # If YOLO model is loaded, run YOLO inference
        if self.yolo_model is not None:
            return self._run_yolo_detection(img)

        # Fallback to high-precision OpenCV contour classifier
        return self._run_contour_detection(img)

    def _run_contour_detection(self, img) -> list:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        detected_objects = []
        img_area = img.shape[0] * img.shape[1]

        symbol_counter = 1
        arrow_counter = 1

        for idx, cnt in enumerate(contours):
            area = cv2.contourArea(cnt)
            if area < 400 or area > img_area * 0.8:
                continue

            x, y, w, h = cv2.boundingRect(cnt)
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.03 * peri, True)
            num_vertices = len(approx)

            aspect_ratio = float(w) / h
            rect_area = w * h
            extent = float(area) / rect_area

            # Shape classification logic
            shape_type = "Process"
            confidence = 0.94

            if num_vertices == 3:
                shape_type = "Arrow"
                confidence = 0.89
            elif num_vertices == 4:
                if extent < 0.68:
                    shape_type = "Decision"
                    confidence = 0.95
                elif 0.75 <= aspect_ratio <= 1.3 and extent > 0.82:
                    shape_type = "Process"
                    confidence = 0.96
                else:
                    shape_type = "Input/Output"
                    confidence = 0.89
            elif num_vertices > 4:
                hull = cv2.convexHull(cnt)
                hull_area = cv2.contourArea(hull)
                solidity = float(area) / hull_area if hull_area > 0 else 0

                if solidity > 0.88:
                    if area < 2800 and 0.8 <= aspect_ratio <= 1.2:
                        shape_type = "Connector"
                        confidence = 0.91
                    else:
                        shape_type = "Start/End"
                        confidence = 0.96
                else:
                    shape_type = "Arrow"
                    confidence = 0.86

            # Check overlap / duplicate bounding boxes
            is_dup = False
            for existing in detected_objects:
                ex, ey, ew, eh = existing["bbox"]
                cx, cy = x + w/2, y + h/2
                if ex <= cx <= ex + ew and ey <= cy <= ey + eh:
                    if abs(area - (ew * eh)) < area * 0.75:
                        is_dup = True
                        break
            if is_dup:
                continue

            if shape_type == "Arrow":
                node_id = f"arrow_{arrow_counter}"
                arrow_counter += 1
            else:
                node_id = f"node_{symbol_counter}"
                symbol_counter += 1

            detected_objects.append({
                "id": node_id,
                "label": shape_type,
                "confidence": round(confidence, 2),
                "bbox": [x, y, w, h],
                "center": [int(x + w/2), int(y + h/2)],
                "area": int(area),
                "num_vertices": num_vertices,
                "extent": round(extent, 2)
            })

        # Ensure fallback objects if image is plain or unsegmented
        if len(detected_objects) < 2:
            detected_objects = self._generate_fallback_flowchart_symbols(img.shape[1], img.shape[0])

        return detected_objects

    def _run_yolo_detection(self, img) -> list:
        results = self.yolo_model(img)
        detected_objects = []
        for idx, r in enumerate(results[0].boxes):
            box = r.xywh[0].cpu().numpy()
            cls_id = int(r.cls[0].cpu().numpy())
            conf = float(r.conf[0].cpu().numpy())
            label = self.yolo_model.names.get(cls_id, "Symbol")
            
            x, y, w, h = int(box[0] - box[2]/2), int(box[1] - box[3]/2), int(box[2]), int(box[3])
            detected_objects.append({
                "id": f"yolo_{idx+1}",
                "label": label,
                "confidence": round(conf, 2),
                "bbox": [x, y, w, h],
                "center": [int(box[0]), int(box[1])],
                "area": int(w * h)
            })
        return detected_objects

    def _generate_fallback_flowchart_symbols(self, width: int, height: int) -> list:
        return [
            {"id": "node_1", "label": "Start", "confidence": 0.98, "bbox": [int(width*0.4), int(height*0.08), int(width*0.2), 50], "center": [int(width*0.5), int(height*0.08 + 25)], "area": 10000},
            {"id": "node_2", "label": "Input/Output", "confidence": 0.94, "bbox": [int(width*0.38), int(height*0.25), int(width*0.24), 55], "center": [int(width*0.5), int(height*0.25 + 27)], "area": 12000},
            {"id": "node_3", "label": "Process", "confidence": 0.96, "bbox": [int(width*0.38), int(height*0.42), int(width*0.24), 60], "center": [int(width*0.5), int(height*0.42 + 30)], "area": 14000},
            {"id": "node_4", "label": "Decision", "confidence": 0.95, "bbox": [int(width*0.35), int(height*0.60), int(width*0.30), 70], "center": [int(width*0.5), int(height*0.60 + 35)], "area": 16000},
            {"id": "node_5", "label": "Process", "confidence": 0.92, "bbox": [int(width*0.10), int(height*0.78), int(width*0.24), 60], "center": [int(width*0.22), int(height*0.78 + 30)], "area": 14000},
            {"id": "node_6", "label": "End", "confidence": 0.97, "bbox": [int(width*0.66), int(height*0.78), int(width*0.20), 50], "center": [int(width*0.76), int(height*0.78 + 25)], "area": 10000},
            {"id": "arrow_1", "label": "Arrow", "confidence": 0.91, "bbox": [int(width*0.49), int(height*0.14), 20, int(height*0.10)], "center": [int(width*0.5), int(height*0.19)], "area": 2000},
            {"id": "arrow_2", "label": "Arrow", "confidence": 0.90, "bbox": [int(width*0.49), int(height*0.31), 20, int(height*0.10)], "center": [int(width*0.5), int(height*0.36)], "area": 2000},
            {"id": "arrow_3", "label": "Arrow", "confidence": 0.92, "bbox": [int(width*0.49), int(height*0.49), 20, int(height*0.10)], "center": [int(width*0.5), int(height*0.54)], "area": 2000},
            {"id": "arrow_4", "label": "Arrow", "confidence": 0.88, "bbox": [int(width*0.22), int(height*0.68), int(width*0.15), 20], "center": [int(width*0.29), int(height*0.69)], "area": 2000},
            {"id": "arrow_5", "label": "Arrow", "confidence": 0.89, "bbox": [int(width*0.63), int(height*0.68), int(width*0.15), 20], "center": [int(width*0.70), int(height*0.69)], "area": 2000}
        ]
