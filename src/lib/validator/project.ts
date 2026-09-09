import * as z from "zod";

const ProjectSchema = z.object({
  projectName: z.string().min(1),
  projectDomain: z.string().min(1),
  projectId: z.string(),
});
