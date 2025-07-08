import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,  // ✅ corrected
      message: 'User not authorised'
    });
  }

  

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,  // ✅ corrected
        message: 'Not Authorised'
      });
    }

    next();
  } catch (error) {
    return res.json({
      success: false,  // ✅ corrected
      message: error.message
    });
  }
};

export default userAuth;