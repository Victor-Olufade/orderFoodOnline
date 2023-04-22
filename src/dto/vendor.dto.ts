export interface VendorDto {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}


export interface VendorLoginInputs{
    email: string;
    password: string;
}

export interface VendorPayload{
    id: string;
    email: string;
    name: string;
    foodType: [string]; 
}

export interface editVendorInputs{
    name: string;
    address: string;
    phone: string;
    foodType: [string]; 
}