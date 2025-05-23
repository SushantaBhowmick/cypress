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

export const UploadBannerFormSchema = z.object({
  banner: z.string().describe("Banner Image"),
});

export const UploadAvatarFormSchema = z.object({
  avatar: z.string().describe("Avatar Image"),
});


export const taskSchema = z.object({
  title: z.string().describe("title").min(1, "Title is required"),
  description: z.string().describe("description").min(1, "Description is required"),
  dueDate: z.string().optional(), 
  assigned_to: z.string().optional(),
  status: z.string().optional(),
});

export type NextApiResponseServerTo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
