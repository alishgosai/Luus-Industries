// Assuming you're using an array to store FAQs for simplicity
let faqs = [];

export const getAllFAQs = () => {
  return faqs;
};

export const getFAQById = (id) => {
  return faqs.find(faq => faq.id === id);
};

export const createFAQ = (faq) => {
  const newFAQ = { ...faq, id: Date.now().toString() };
  faqs.push(newFAQ);
  return newFAQ;
};

export const updateFAQ = (id, updatedFAQ) => {
  const index = faqs.findIndex(faq => faq.id === id);
  if (index !== -1) {
    faqs[index] = { ...faqs[index], ...updatedFAQ };
    return faqs[index];
  }
  return null;
};

export const deleteFAQ = (id) => {
  const index = faqs.findIndex(faq => faq.id === id);
  if (index !== -1) {
    const deletedFAQ = faqs[index];
    faqs = faqs.filter(faq => faq.id !== id);
    return deletedFAQ;
  }
  return null;
};

