import * as z from "zod";

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project must have at least 2 characters")
    .max(12, "Project name is too long"),

  Domain: z
    .string()
    .trim()
    .min(3, "Domain must have at least 5 characters")
    .max(255, "Domain name is too long")
    .regex(
      /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
      "Enter a valid domain, for example: example.com",
    ),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
