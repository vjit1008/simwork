import API from './axios';

export const fetchProjects      = ()         => API.get('/api/projects');
export const fetchProject       = (id)       => API.get(`/api/projects/${id}`);
export const createProject      = (data)     => API.post('/api/projects', data);
export const pushWork           = (id, note) => API.post(`/api/projects/${id}/push`, { note });
export const pullBack           = (id, note) => API.post(`/api/projects/${id}/pullback`, { note });
export const fetchWorkflow      = (id)       => API.get(`/api/projects/${id}/workflow`);
export const fetchNotifications = ()         => API.get('/api/notifications');
export const markNotificationsRead = ()      => API.patch('/api/notifications/read');
export const fetchChannels      = ()         => API.get('/api/channels');
export const fetchChannel       = (id)       => API.get(`/api/channels/${id}`);
export const postMessage        = (id, text) => API.post(`/api/channels/${id}/message`, { text });
export const createChannel      = (data)     => API.post('/api/channels', data);
