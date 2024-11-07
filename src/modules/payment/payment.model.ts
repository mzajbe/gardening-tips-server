import mongoose, { Schema } from 'mongoose';
import { TPayment } from './payment.interface';




const TPaymentSchema: Schema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { type: String, required: true },
    tnxId: { type: String, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, required: true },
}, {
    timestamps: true 
});

// Create the model
const PaymentModel = mongoose.model<TPayment>('Payment', TPaymentSchema);

export default PaymentModel;
