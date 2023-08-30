import { getUserData } from "@/auth/jwtService";

export const check = (role: string[] | string) => {
  const roles = getUserData().role.map((role) => role.unique_name);

  if (Array.isArray(role)) {
    return role.some((item) => roles.includes(item));
  }
  return roles.includes(role);
};
