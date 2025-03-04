import { Socket, Socket as NetServer } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),

  password: z.string().describe("Password").min(1, "Password is required"),
});

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe("Workspace Name")
    .min(1, "Workspace name must be min of 1 character"),
  logo: z.any(),
});

export const taskFormSchema = z.object({
  title: z
    .string()
    .describe("Task Title")
    .min(1, "Task title must be min of 1 character"),
  description: z.any(),
});

export const UploadBannerFormSchema = z.object({
  banner: z.string().describe("Banner Image"),
});

export type NextApiResponseServerTo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
