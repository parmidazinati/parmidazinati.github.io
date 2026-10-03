import { timingSafeEqual } from "crypto";

/**
 * Verify an admin passcode against ADMIN_PASSCODE (env).
 * Uses a constant-time comparison to avoid timing leaks.
 */
export function isValidPasscode(passcode: unknown): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected || expected.length === 0) return false;
  if (typeof passcode !== "string" || passcode.length === 0) return false;

  const given = Buffer.from(passcode);
  const target = Buffer.from(expected);
  return given.length === target.length && timingSafeEqual(given, target);
}

/** Extract the passcode from the `x-admin-passcode` request header. */
export function passcodeFromRequest(request: Request): unknown {
  return request.headers.get("x-admin-passcode");
}
