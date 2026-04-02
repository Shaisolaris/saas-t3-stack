import { createTRPCRouter } from "../trpc";
import { projectRouter, taskRouter } from "./routers/index";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
