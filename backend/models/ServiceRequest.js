import { v4 as uuidv4 } from 'uuid';

class ServiceRequest {
  constructor(type, customerName, email, phone, details) {
    this.id = uuidv4();
    this.type = type; // 'warranty', 'technical', or 'sales'
    this.customerName = customerName;
    this.email = email;
    this.phone = phone;
    this.details = details;
    this.status = 'pending';
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update(data) {
    const allowedFields = ['status', 'details'];
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });
    this.updatedAt = new Date().toISOString();
  }
}

export default ServiceRequest;

