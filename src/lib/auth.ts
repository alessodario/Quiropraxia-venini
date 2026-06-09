import { jwtVerify, SignJWT } from "jose";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "super-secret-key-change-this-in-production";
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}
