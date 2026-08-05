import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const uploadDiagramApi = async (formData) => {
  const response = await axios.post('/api/upload', formData, {
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
  return `/api/report/${sessionId}`;
};

export default API;
