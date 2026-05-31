export const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 10*60*1000,
    path: "/"
}