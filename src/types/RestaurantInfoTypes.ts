
//  Types
 export type MenuItem = {
  itemName: string;
  category: string ;
  price: number ;
  file: File | null;
};

 export type ComplianceDetail = {
  licenseType: string; // FSSAI / GST / Trade License
  licenseNumber: string;
  validFrom: string;
  validTill: string;
};

export type Branch = {
  branchName: string;
  branchCode: string;
  complianceDetails: ComplianceDetail[];
};

export type RestaurantInfoValues = {
  restaurantName: string;
  ownerName: string;
  menuItems: MenuItem[];
  branches: Branch[];
};
