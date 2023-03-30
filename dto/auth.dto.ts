import { VendorPayload } from "./vendor.dto";
import { CustomerPayload } from "./customer.dto";

export type AuthPayLoad = VendorPayload | CustomerPayload;

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayLoad
        }
    }
}