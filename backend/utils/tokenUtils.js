export const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,  // Helps prevent client-side access to the cookie
        secure: process.env.NODE_ENV === 'production', // Set to true in production to ensure cookie is sent over HTTPS
        sameSite: 'Strict', // Helps prevent CSRF attacks
        secure: false,  
        maxAge: 7 * 24 * 60 * 60 * 1000, // Refresh token expiry (7 days)
    });
};
