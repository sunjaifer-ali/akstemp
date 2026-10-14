import {cookies} from "next/headers";import {SignJWT,jwtVerify} from "jose";
const COOKIE="akshaya_session";function key(){const s=process.env.AUTH_SECRET;if(!s||s.length<32)throw Error("AUTH_SECRET must be at least 32 characters.");return new TextEncoder().encode(s)}
export type SessionUser={id:string;username:string;displayName:string;role:"OWNER"|"ADMIN"|"STAFF"};
export async function createSession(u:SessionUser){const token=await new SignJWT(u).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(key());(await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:28800});}
export async function getSession():Promise<SessionUser|null>{try{const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const{payload}=await jwtVerify(token,key());if(!payload.id||!payload.username||!payload.displayName||!payload.role)return null;return{id:String(payload.id),username:String(payload.username),displayName:String(payload.displayName),role:payload.role as SessionUser["role"]}}catch{return null}}
export async function destroySession(){(await cookies()).delete(COOKIE)}
