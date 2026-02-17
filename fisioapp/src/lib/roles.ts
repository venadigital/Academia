export const roleLabels: Record<string, string> = {
  superadmin: "Superadmin",
  admin: "Recepción/Admin",
  fisiatra: "Fisiatra",
  fisioterapeuta: "Fisioterapeuta",
  paciente: "Paciente",
};

export type RoleKey = keyof typeof roleLabels;

export function toRoleLabel(role?: string | null) {
  if (!role) return "Usuario";
  return roleLabels[role] ?? role;
}
