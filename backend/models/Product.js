class Product {
    constructor(id, name, date, warranty, details, serialNumber, purchaseLocation, coverageDetails, termsAndConditions) {
      this.id = id;
      this.name = name;
      this.date = date;
      this.warranty = warranty;
      this.details = details;
      this.serialNumber = serialNumber;
      this.purchaseLocation = purchaseLocation;
      this.coverageDetails = coverageDetails;
      this.termsAndConditions = termsAndConditions;
    }
  }
  
  const warrantyProducts = [
    new Product(
      1, 
      'RS 600MM Oven', 
      '10 December 2023', 
      '10 Dec 2028', 
      'Includes coverage for manufacturing defects.',
      'RS600-123456',
      'Luxe Appliances Store, Sydney',
      [
        'Full replacement for first 2 years',
        'Parts and labor covered for 5 years',
        'Extended warranty available for purchase'
      ],
      'Warranty void if product is misused or modified.'
    ),
    new Product(
      2, 
      'SCM-120 Steam Cabinet', 
      '10 December 2023', 
      '10 Dec 2028', 
      'Includes coverage for manufacturing defects.',
      'SCM120-789012',
      'Luxe Appliances Store, Melbourne',
      [
        'Full replacement for first year',
        'Parts and labor covered for 5 years',
        'Steam generator warranty: 2 years'
      ],
      'Regular maintenance required to maintain warranty validity.'
    ),
    new Product(
      3, 
      'SCM-60 Steam Cabinet', 
      '10 December 2023', 
      '10 Dec 2028', 
      'Includes coverage for manufacturing defects.',
      'SCM60-345678',
      'Luxe Appliances Store, Brisbane',
      [
        'Full replacement for first year',
        'Parts and labor covered for 5 years',
        'Steam generator warranty: 2 years'
      ],
      'Warranty valid only with proof of annual professional servicing.'
    ),
    new Product(
      4, 
      'YC 750mm Yum Cha Steamers', 
      '10 December 2023', 
      '10 Dec 2028', 
      'Includes coverage for manufacturing defects.',
      'YC750-901234',
      'Luxe Appliances Store, Perth',
      [
        'Full replacement for first 18 months',
        'Parts and labor covered for 5 years',
        'Steamer baskets warranty: 1 year'
      ],
      'Commercial use may affect warranty terms.'
    ),
    new Product(
      5, 
      'RC 450mm Rice Roll Steamers', 
      '10 December 2023', 
      '10 Dec 2028', 
      'Includes coverage for manufacturing defects.',
      'RC450-567890',
      'Luxe Appliances Store, Adelaide',
      [
        'Full replacement for first year',
        'Parts and labor covered for 5 years',
        'Steamer trays warranty: 6 months'
      ],
      'Warranty does not cover damage from improper cleaning methods.'
    ),
  ];
  
  export const getWarrantyProductsData = () => {
    return [...warrantyProducts];
  };
  
  export const getWarrantyProductData = (id) => {
    const product = warrantyProducts.find(product => product.id === id);
    return product ? { ...product } : null;
  };
  
  export default Product;
  
  