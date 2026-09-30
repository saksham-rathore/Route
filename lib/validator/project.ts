import * as z from "zod";

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project must have at least 2 characters")
    .max(64, "Project name is too long"),

  domain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Domain must have at least 3 characters")
    .max(255, "Domain name is too long")
    .regex(
      /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
      "Enter a valid domain, for example: example.com",
    ),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = z.object({
  name: z.string().trim().min(2).max(64).optional(),
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(255)
    .regex(/^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i, "Enter a valid domain")
    .optional(),
  status: z.enum(["ACTIVE", "PAUSED"]).optional(),
  timeZone: z.string().max(64).optional(),
  dataRetentionDays: z.coerce.number().int().min(1).max(365).optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
