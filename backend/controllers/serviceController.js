import ServiceRequest from '../models/ServiceRequest.js';

let serviceRequests = [];

export const createServiceRequest = (req, res) => {
  const { type, customerName, email, phone, details } = req.body;
  const newRequest = new ServiceRequest(type, customerName, email, phone, details);
  serviceRequests.push(newRequest);
  res.status(201).json(newRequest);
};

export const getAllServiceRequests = (req, res) => {
  res.status(200).json(serviceRequests);
};

export const getServiceRequestById = (req, res) => {
  const request = serviceRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Service request not found' });
  }
  res.status(200).json(request);
};

export const updateServiceRequest = (req, res) => {
  const request = serviceRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Service request not found' });
  }
  request.update(req.body);
  res.status(200).json(request);
};

export const getServiceRequestsByType = (req, res) => {
  const { type } = req.params;
  const filteredRequests = serviceRequests.filter(r => r.type === type);
  res.status(200).json(filteredRequests);
};

