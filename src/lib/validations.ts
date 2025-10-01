import { z } from "zod";

// Validation pour les invitations
export const invitationSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .min(3, "Email trop court")
    .max(255, "Email trop long"),
  role: z.enum(["user_b2b", "manager_b2b"], {
    errorMap: () => ({ message: "Rôle invalide" }),
  }),
  orgId: z.string().uuid("ID organisation invalide"),
  teamId: z.string().uuid("ID équipe invalide").optional(),
});

// Validation pour les organisations
export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, "Nom trop court")
    .max(100, "Nom trop long")
    .regex(/^[a-zA-Z0-9\s\-'àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]+$/, "Caractères non autorisés"),
});

// Validation pour les équipes
export const teamSchema = z.object({
  name: z
    .string()
    .min(2, "Nom trop court")
    .max(100, "Nom trop long")
    .regex(/^[a-zA-Z0-9\s\-'àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]+$/, "Caractères non autorisés"),
  orgId: z.string().uuid("ID organisation invalide"),
});

// Validation pour les tokens
export const tokenSchema = z.object({
  token: z
    .string()
    .uuid("Token invalide")
    .or(z.string().length(36, "Format de token invalide")),
});

// Validation pour les entrées d'humeur
export const moodEntrySchema = z.object({
  mood_level: z
    .number()
    .int("Niveau d'humeur doit être un entier")
    .min(1, "Niveau minimum: 1")
    .max(10, "Niveau maximum: 10"),
  emotions: z
    .array(z.string().min(1).max(50))
    .min(1, "Au moins une émotion requise")
    .max(5, "Maximum 5 émotions"),
  notes: z
    .string()
    .max(1000, "Notes trop longues")
    .optional(),
});

// Validation pour les évaluations
export const assessmentSchema = z.object({
  instrument: z.enum(["WHO5", "PHQ9", "GAD7", "PSS10"], {
    errorMap: () => ({ message: "Instrument invalide" }),
  }),
  answers: z.record(z.number().int().min(0).max(5)),
});

// Validation pour les profils utilisateur
export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nom trop court")
    .max(100, "Nom trop long")
    .regex(/^[a-zA-Z\s\-'àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]+$/, "Caractères non autorisés")
    .optional(),
  avatar_url: z
    .string()
    .url("URL invalide")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio trop longue")
    .optional(),
});

// Validation pour les actions manager
export const managerActionSchema = z.object({
  action_title: z
    .string()
    .min(3, "Titre trop court")
    .max(200, "Titre trop long"),
  category: z.enum(["wellbeing", "training", "support", "communication"], {
    errorMap: () => ({ message: "Catégorie invalide" }),
  }),
  description: z
    .string()
    .max(1000, "Description trop longue")
    .optional(),
  target_date: z
    .string()
    .datetime("Date invalide")
    .optional(),
});

// Validation pour les paramètres de notification
export const notificationSettingsSchema = z.object({
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  weekly_summary: z.boolean(),
  achievement_alerts: z.boolean(),
});

// Validation pour les rapports PDF
export const pdfReportSchema = z.object({
  userId: z.string().uuid("ID utilisateur invalide"),
  startDate: z.string().datetime("Date de début invalide"),
  endDate: z.string().datetime("Date de fin invalide"),
  reportType: z.enum(["weekly", "monthly"], {
    errorMap: () => ({ message: "Type de rapport invalide" }),
  }),
});

// Helper pour valider et sanitizer
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Helper pour validation async avec messages d'erreur personnalisés
export async function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return { success: false, errors: ["Erreur de validation inconnue"] };
  }
}
