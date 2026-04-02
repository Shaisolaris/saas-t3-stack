import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

const projects: Array<{ id: string; name: string; description: string | null; slug: string; ownerId: string; createdAt: Date }> = [
  { id: "p1", name: "Marketing Site", description: "Company website redesign", slug: "marketing-site", ownerId: "user1", createdAt: new Date() },
  { id: "p2", name: "Mobile App", description: "React Native customer app", slug: "mobile-app", ownerId: "user1", createdAt: new Date() },
];

const tasks: Array<{ id: string; title: string; description: string | null; status: string; priority: string; projectId: string; assigneeId: string | null; dueDate: Date | null; createdAt: Date }> = [
  { id: "t1", title: "Design homepage", description: "Create Figma mockups", status: "in_progress", priority: "high", projectId: "p1", assigneeId: "user1", dueDate: new Date(Date.now() + 86400000 * 3), createdAt: new Date() },
  { id: "t2", title: "Setup CI/CD", description: "GitHub Actions pipeline", status: "todo", priority: "medium", projectId: "p1", assigneeId: null, dueDate: null, createdAt: new Date() },
];

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => projects),
  getBySlug: protectedProcedure.input(z.object({ slug: z.string() })).query(async (opts) => {
    const project = projects.find((p) => p.slug === opts.input.slug);
    if (!project) throw new TRPCError({ code: "NOT_FOUND" });
    return project;
  }),
  create: protectedProcedure.input(z.object({ name: z.string().min(1).max(100), description: z.string().max(500).optional() })).mutation(async (opts) => {
    const slug = opts.input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const project = { id: `p${Date.now()}`, name: opts.input.name, description: opts.input.description ?? null, slug, ownerId: "user1", createdAt: new Date() };
    projects.push(project);
    return project;
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async (opts) => {
    const idx = projects.findIndex((p) => p.id === opts.input.id);
    if (idx === -1) throw new TRPCError({ code: "NOT_FOUND" });
    projects.splice(idx, 1);
    return { success: true };
  }),
});

export const taskRouter = createTRPCRouter({
  getByProject: protectedProcedure.input(z.object({ projectId: z.string() })).query(async (opts) => tasks.filter((t) => t.projectId === opts.input.projectId)),
  create: protectedProcedure.input(z.object({ title: z.string().min(1), projectId: z.string(), priority: z.enum(["low", "medium", "high"]).default("medium") })).mutation(async (opts) => {
    const task = { id: `t${Date.now()}`, title: opts.input.title, description: null, status: "todo", priority: opts.input.priority, projectId: opts.input.projectId, assigneeId: null, dueDate: null, createdAt: new Date() };
    tasks.push(task);
    return task;
  }),
  updateStatus: protectedProcedure.input(z.object({ id: z.string(), status: z.enum(["todo", "in_progress", "in_review", "done"]) })).mutation(async (opts) => {
    const task = tasks.find((t) => t.id === opts.input.id);
    if (!task) throw new TRPCError({ code: "NOT_FOUND" });
    task.status = opts.input.status;
    return task;
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async (opts) => {
    const idx = tasks.findIndex((t) => t.id === opts.input.id);
    if (idx === -1) throw new TRPCError({ code: "NOT_FOUND" });
    tasks.splice(idx, 1);
    return { success: true };
  }),
});
