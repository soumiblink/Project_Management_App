import { NextRequest } from 'next/server';
import { verifyAccessToken, JWTPayload } from './auth';

/**
 * Extract and verify JWT token from request
 * Checks both Authorization header and cookies
 */
export function getAuthToken(req: NextRequest): { token: string; decoded: JWTPayload } | null {
  try {
    // Check Authorization header first
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('accessToken')?.value;
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : cookieToken;

    if (!token) {
      return null;
    }

    const decoded = verifyAccessToken(token);
    return { token, decoded };
  } catch (error) {
    return null;
  }
}
