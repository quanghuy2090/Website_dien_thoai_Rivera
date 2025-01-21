import monggoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDb = async (req, res) => {
    try {
        await monggoose.connect(process.env.CONNECT_DB)
        console.log("ket noi thanh cong")
    } catch (error) {
        console.log("ket noi that bai ", error)
    }
}
export default connectDb