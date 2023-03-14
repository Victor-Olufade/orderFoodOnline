import { VendorPayload } from "./vendor.dto";

export type AuthPayLoad = VendorPayload;

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayLoad
        }
    }
}