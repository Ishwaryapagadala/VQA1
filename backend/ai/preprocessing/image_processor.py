import cv2
import numpy as np
import base64

class ImageProcessor:
    def __init__(self):
        pass

    def process(self, image_path: str) -> dict:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image at {image_path}")

        h, w = img.shape[:2]

        # 1. Standardize Dimensions (Max 1200px while maintaining aspect ratio)
        max_dim = 1200
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
            h, w = img.shape[:2]

        # 2. Grayscale Conversion
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 3. Denoising & Gaussian Blur
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # 4. Adaptive & Otsu Thresholding
        _, otsu_thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        # 5. Morphological Closing & Opening (Connect broken line segments, smooth contours)
        kernel_close = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        kernel_open = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        morph_close = cv2.morphologyEx(otsu_thresh, cv2.MORPH_CLOSE, kernel_close)
        morph = cv2.morphologyEx(morph_close, cv2.MORPH_OPEN, kernel_open)

        # 6. Canny Edge Detection
        canny = cv2.Canny(blurred, 50, 150)

        # 7. Deskew Angle Estimation (Rotation Alignment)
        angle = self._estimate_skew_angle(morph)
        if abs(angle) > 0.5 and abs(angle) < 45:
            (cx, cy) = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D((cx, cy), angle, 1.0)
            img = cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            _, otsu_thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            morph = cv2.morphologyEx(otsu_thresh, cv2.MORPH_CLOSE, kernel_close)
            canny = cv2.Canny(blurred, 50, 150)

        return {
            "original_size": [w, h],
            "processed_size": [img.shape[1], img.shape[0]],
            "skew_angle": round(angle, 2),
            "gray": self._to_b64(gray),
            "thresh": self._to_b64(otsu_thresh),
            "morph": self._to_b64(morph),
            "canny": self._to_b64(canny)
        }

    def _estimate_skew_angle(self, binary_img) -> float:
        coords = np.column_stack(np.where(binary_img > 0))
        if len(coords) < 10:
            return 0.0
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        return float(angle)

    def _to_b64(self, img_array) -> str:
        _, buffer = cv2.imencode('.png', img_array)
        return "data:image/png;base64," + base64.b64encode(buffer).decode('utf-8')
