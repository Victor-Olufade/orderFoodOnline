import {IsEmail, IsEmpty, Length} from 'class-validator';

export class CreateCustomerInputs {
    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password: string;
}
export class EditCustomerInputs {
    @Length(3, 16)
    firstName: string;

    @Length(6, 32)
    address: string;

    @Length(3, 16)
    lastName: string;
}
export class CustomerLoginInputs {
    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;
}

export class ResendInput {
    @IsEmail()
    email: string;
}

export interface CustomerPayload {
    id: string;
    email: string;
    verified: boolean;
}

export class OrderInputs{
    id: string;
    unit: number
}