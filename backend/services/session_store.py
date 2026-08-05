import uuid

class SessionStore:
    def __init__(self):
        self._sessions = {}

    def create_session(self, image_path: str, filename: str) -> str:
        session_id = str(uuid.uuid4())
        self._sessions[session_id] = {
            "session_id": session_id,
            "filename": filename,
            "image_path": image_path,
            "pipeline": {},
            "vqa_history": []
        }
        return session_id

    def get_session(self, session_id: str) -> dict:
        return self._sessions.get(session_id)

    def update_session(self, session_id: str, data: dict):
        if session_id in self._sessions:
            self._sessions[session_id].update(data)

session_store = SessionStore()
