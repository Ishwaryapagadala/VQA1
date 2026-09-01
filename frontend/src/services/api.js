import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vqa1-project.onrender.com/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const uploadDiagramApi = async (formData) => {
  const response = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const loadPresetApi = async (presetId) => {
  const response = await API.post(`/preset/${presetId}`);
  return response.data;
};

export const analyzeDiagramApi = async (sessionId) => {
  const response = await API.post('/analyze', { session_id: sessionId });
  return response.data;
};

export const validateDiagramApi = async (sessionId) => {
  const response = await API.post('/validate', { session_id: sessionId });
  return response.data;
};

export const reasonAnomaliesApi = async (sessionId) => {
  const response = await API.post('/reason', { session_id: sessionId });
  return response.data;
};

export const healDiagramApi = async (sessionId) => {
  const response = await API.post('/heal', { session_id: sessionId });
  return response.data;
};

export const askVqaApi = async (sessionId, question) => {
  const response = await API.post('/vqa', { session_id: sessionId, question });
  return response.data;
};

export const getReportUrl = (sessionId) => {
  return `${BASE_URL}/report/${sessionId}`;
};

export default API;
