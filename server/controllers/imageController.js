import userModel from "../models/userModel.js";
import formData from 'form-data'
import axios from 'axios'

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body
        const user = await userModel.findById(userId)
        if (!user || !prompt) {
            return res.json({
                success: false,
                message: 'Missing detaiks'
            })

        }
        if (user.creditBalance == 0 || userModel.creditBalance < 0) {
            return res.json({
                success: false,
                message: " insuuficent balanc ",
            })
        }
        const formData = new FormData()
        formData.append('prompt', prompt)
        const {data}= await axios.post("https://clipdrop-api.co/text-to-image/v1", formData,{

            headers: {
            'x-api-key': process.env.CLIPDROP_API,
        },
        responseType: 'arraybuffer'

        }
        )
        const base63Image=Buffer.from(data,'binary').toString('base64')
        const resultImage=`data:image/png:base64,${base63Image}`
        await userModel.findOneAndUpdate(user._id, {creditBalance: user.creditBalance-1}) // deducted credits
        res.json({
            success:true,
            message:"Image generated",
            creditBalance: user.creditBalance-1,
            resultImage
        })

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message

        })


    }

}