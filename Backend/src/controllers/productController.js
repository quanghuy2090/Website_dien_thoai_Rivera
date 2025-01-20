import Product from "../models/productModel";

export const getAllProducts = async (req, res) => {

    try {
        const data = await Product.find();
        if (!data || data.length === 0) {
            return res.status(400).json({
                message: "Product not found",
            })
        }
        res.status(200).json({
            message: "Product successfully",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error"
        });
    }
}

export const getProductsById = async (req, res) => {

    try {
        const id = req.params.id;
        const data = await Product.findById(id);
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            })
        };
        return res.status(200).json({
            message: "get product successfully",
            data,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "server error"
        });
    }

}

export const createProducts = async (req, res) => {

    try {
        const data = await Product.create(req.body);
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "no more products"
            })
        }
        res.status(200).json({
            message: "Product created successfully",
            data,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
        })
    }
}

export const updateProducts = async (req, res) => {
    try {
        const data = await Product.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
        if (!data) {
            return res.status(400).json({ message: "Product not found" })
        }
        res.status(200).json({
            message: "Product updated successfully",
            data
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
        })
    }
}

export const deleteProducts = async (req, res) => {
    try {
        const data = await Product.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).json({ message: "Product not found" })
        }
        res.status(200).json({
            message: "Product deleted successfully",
            data
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
        })
    }
}