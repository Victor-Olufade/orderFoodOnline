import mongoose,{Schema} from 'mongoose';

export interface FoodDoc extends Document{
    vendorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: string;
    price: number;
    rating: number;
    imagesArr: [string]
}

const foodSchema = new Schema({
    vendorId: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String},
    foodType: {type: String, required: true},
    readyTime: {type: String},
    price: {type: Number, required: true},
    rating: {type: String},
    imagesArr: {type: [String]},
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


export const Food = mongoose.model<FoodDoc>('food', foodSchema)


