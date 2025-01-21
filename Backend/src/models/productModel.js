import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
        // Thuơng hiệu
    },
    releaseDate: {
        type: Date,
        // Ngày ra mắt
    },
    discount: {
        type: Number,
        default: 0
        // giảm giá
    },
    stock: {
        type: Number,
        required: true, // Số lượng tồn kho
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    }
}, {
    versionKey: false,
    timestamps: true
})
export default mongoose.model("Product", productSchema);