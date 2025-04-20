import dotenv from "dotenv";
import fetch from "node-fetch";
import Product from "../models/Product.js"
dotenv.config();

export const generateContent = async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        const data = await response.json();

        if (data && data.candidates && data.candidates.length > 0) {
            const text = data.candidates[0].content.parts[0].text;
            res.json({ response: text });
        } else {
            res.status(500).json({ message: "No response from Gemini API" });
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({ message: "Error generating content" });
    }
};


export const explainProduct = async (req, res) => {
    const { productId } = req.params;
    const { consultQuery } = req.body; // Nhận câu hỏi từ khách hàng

    try {
        const product = await Product.findById(productId)
            .populate("variants.color")
            .populate("variants.capacity")
            .populate("categoryId");

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        // Tạo prompt dựa trên câu hỏi của khách hàng
        const prompt = `
Bạn là một chuyên gia tư vấn sản phẩm thân thiện và chuyên nghiệp. Dựa trên thông tin sản phẩm dưới đây, hãy trả lời câu hỏi hoặc yêu cầu tư vấn của khách hàng một cách chi tiết, dễ hiểu và hấp dẫn. Nếu câu hỏi không rõ hoặc không được cung cấp, hãy cung cấp một mô tả chi tiết và hấp dẫn về sản phẩm.

**Thông tin sản phẩm:**
- Tên sản phẩm: ${product.name}
- Danh mục: ${product.categoryId?.name || "Không rõ"}
- Mô tả ngắn: ${product.short_description || "Không có"}
- Mô tả dài: ${product.long_description || "Không có"}
- Các phiên bản:
${product.variants
                .map(
                    (variant) =>
                        `- Màu: ${variant.color?.name || "Không rõ"}, Dung lượng: ${variant.capacity?.name || "Không rõ"}, Giá: ${variant.price}đ, Khuyến mãi: ${variant.sale}%`
                )
                .join("\n")}

**Câu hỏi hoặc yêu cầu của khách hàng:**
${consultQuery || "Hãy cung cấp mô tả chi tiết và hấp dẫn về sản phẩm này."}

Hãy trả lời sao cho phù hợp với câu hỏi, tập trung vào lợi ích, tính năng và lý do nên chọn sản phẩm. Đảm bảo câu trả lời dễ hiểu, thân thiện và khuyến khích khách hàng quan tâm đến sản phẩm.
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const data = await response.json();

        if (data?.candidates?.length > 0) {
            const resultText = data.candidates[0].content.parts[0].text;
            return res.json({ explanation: resultText });
        } else {
            return res.status(500).json({ message: "Gemini không phản hồi kết quả" });
        }
    } catch (error) {
        console.error("Gemini explainProduct error:", error);
        return res.status(500).json({ message: "Lỗi khi sinh nội dung AI" });
    }
};
