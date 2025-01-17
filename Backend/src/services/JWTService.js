const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      payload,
    },
    "access_token",
    { expiresIn: "1h" }
  );
  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      payload,
    },
    "refresh_token",
    { expiresIn: "365d" }
  );
  return refresh_token;
};

const refreshTokenJwtService = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("token", token);
      jwt.verify(token, "refresh_token", async (err, user) => {
        if (err) {
          resolve({
            status: "Error",
            message: "The authemtication",
          });
        }
        const { payload } = user;
        const access_token = await genneralAccessToken({
          id: payload?.id,
          isAdmin: payload?.isAdmin,
        });
        // Trả về thành công
        resolve({
          status: "Ok",
          message: "Refresh token success",
          access_token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService,
};
