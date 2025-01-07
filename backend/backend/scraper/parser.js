import { parse } from 'node-html-parser';
import { SELECTORS, PRODUCT_STRUCTURE } from './constants.js';

export function parseProductPage(html, category, subcategory) {
  const root = parse(html);
  const product = { ...PRODUCT_STRUCTURE };
  
  product.id = root.querySelector(SELECTORS.PRODUCT_NAME)?.text?.trim().split(' ')[0] || '';
  product.name = root.querySelector(SELECTORS.PRODUCT_NAME)?.text?.trim() || '';
  product.description = root.querySelector(SELECTORS.PRODUCT_DESCRIPTION)?.text?.trim() || '';
  product.category = category;
  product.subcategory = subcategory;

  Object.keys(SELECTORS.SPECIFICATIONS).forEach(key => {
    const selector = SELECTORS.SPECIFICATIONS[key];
    product.specifications[key.toLowerCase()] = root.querySelector(selector)?.text?.trim() || '';
  });

  Object.keys(SELECTORS.MODEL_INFO).forEach(key => {
    const selector = SELECTORS.MODEL_INFO[key];
    product.model[key.toLowerCase()] = root.querySelector(selector)?.text?.trim() || '';
  });

  product.lastUpdated = new Date().toISOString();

  return product;
}

export function parseProductLinks(html) {
  const root = parse(html);
  return Array.from(root.querySelectorAll(SELECTORS.PRODUCT_LINK))
    .map(a => a.getAttribute('href'))
    .filter(Boolean);
}