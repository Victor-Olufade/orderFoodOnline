import mongoose,{Schema} from 'mongoose';

export interface OrderDoc extends Document{
    OrderId: string,
    items: [any],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentResponse: string,
    orderStatus: string
}

const orderSchema = new Schema({
    orderId: {type: String, required: true},
    items: [
        {
            food: {type: Schema.Types.ObjectId, ref: 'food', required: true},
            unit: {type: Number, required: true}
        }
    ],
    totalAmount: {type: Number, required: true},
    orderDate: {type: Date},
    paidThrough: {type: String},
    paymentResponse: {type: String},
    orderStatus: {type: String}
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.createdAt,
            delete ret.updatedAt,
            delete ret.__v
        }
    },
    timestamps: true
})


export const Order = mongoose.model<OrderDoc>('order', orderSchema)


