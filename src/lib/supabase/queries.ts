"use server";

import { validate } from "uuid";
import db from "./db";
import {
  Subscription,
  workspace,
  File,
  Folder,
  User,
  Price,
  tasks as tasksTypes,
} from "./supabase-types";
import { files, workspaces, folders, users } from "../../../migrations/schema";
import { and, eq, ilike, notExists } from "drizzle-orm";
import { collaborators, tasks } from "./schema";
import { revalidatePath } from "next/cache";

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error ${error}` };
  }
};
export const findUser = async (userId: string) => {
  const response = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  return response;
};

export const createWorkspace = async (workspace: workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) {
    return { data: [], error: "Error" };
  }
  try {
    const response = (await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1)) as workspace[];
    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};
export const getFileDetails = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid) {
    return { data: [], error: "Error" };
  }
  try {
    const response = (await db
      .select()
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1)) as File[];
    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};
export const getFolderDetails = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) {
    return { data: [], error: "Error" };
  }
  try {
    const response = (await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId))
      .limit(1)) as Folder[];
    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return;
  try {
    await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const getFiles = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from(files)
      .orderBy(files.createdAt)
      .where(eq(files.folderId, folderId))) as File[] | [];
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const getFolders = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) return { data: null, error: "Error" };

  try {
    const results: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const deleteFile = async (fileId: string) => {
  if (!fileId) return;
  await db.delete(files).where(eq(files.id, fileId));
};

export const deleteFolder = async (folderId: string) => {
  if (!folderId) return;
  await db.delete(files).where(eq(files.id, folderId));
};

export const getPrivateWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const privateWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as workspace[];

  return privateWorkspaces;
};

export const getCollaboratingWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const collaboratedWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as workspace[];

  return collaboratedWorkspaces;
};

export const getSharedWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const sharedWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as workspace[];

  return sharedWorkspaces;
};

export const getAllUsers = async () => {
  const user = await db.select().from(users);
  return user;
};

export const addCollaborators = async (users: User[], workspaceId: string) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (!userExists)
      await db.insert(collaborators).values({ workspaceId, userId: user.id });
  });
};

export const removeCollaborators = async (
  users: User[],
  workspaceId: string
) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (userExists)
      await db
        .delete(collaborators)
        .where(
          and(
            eq(collaborators.workspaceId, workspaceId),
            eq(collaborators.userId, user.id)
          )
        );
  });
};

export const createFolder = async (folder: Folder) => {
  try {
    const results = await db.insert(folders).values(folder);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const createFile = async (file: File) => {
  try {
    await db.insert(files).values(file);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateFolder = async (
  folder: Partial<Folder>,
  folderId: string
) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderId));
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: "Error" };
  }
};

export const updateFile = async (file: Partial<File>, fileId: string) => {
  try {
    const response = await db
      .update(files)
      .set(file)
      .where(eq(files.id, fileId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateWorkspace = async (
  workspace: Partial<workspace>,
  workspaceId: string
) => {
  try {
    await db
      .update(workspaces)
      .set(workspace)
      .where(eq(workspaces.id, workspaceId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const getCollaborators = async (workspaceId: string) => {
  const response = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.workspaceId, workspaceId));

  if (!response.length) return [];
  const userInformation: Promise<User | undefined>[] = response.map(
    async (user) => {
      const exists = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, user.userId),
      });
      return exists;
    }
  );
  const resolveUsers = await Promise.all(userInformation);
  return resolveUsers.filter(Boolean) as User[];
};

export const getUsersFromSearch = async (email: string) => {
  if (!email) return [];
  const accounts = db
    .select()
    .from(users)
    .where(ilike(users.email, `${email}%`));
  return accounts;
};

export const getMembersFromSearch = async (
  email: string,
  w_spaceId: string
) => {
  if (!email) return [];
  const members = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      email: users.email,
      billingAddress: users.billingAddress,
      paymentMethod: users.paymentMethod,
      updatedAt: users.updatedAt,
    })
    .from(collaborators)
    .innerJoin(users, eq(collaborators.userId, users.id))
    .where(
      and(
        eq(collaborators.workspaceId, w_spaceId),
        ilike(users.email, `${email}%`)
      )
    );
  return members;
};

export const getUserById = async (userId: string) => {
  if (!userId) return;

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  return user;
};

export const updateUserById = async (
  userId: string,
  userData: Partial<User>
) => {
  try {
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, userId));
    return { data: result, error: null };
  } catch (error) {
    console.log("error", error);
    return { data: null, error: error };
  }
};

export const getActiveProductsWithPrice = async () => {
  try {
    const res = await db.query.products.findMany({
      where: (pro, { eq }) => eq(pro.active, true),
      with: {
        prices: {
          where: (pri, { eq }) => eq(pri.active, true),
        },
      },
    });
    if (res.length) return { data: res, error: null };
    return { data: [], error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error };
  }
};

export const createTask = async (task: tasksTypes) => {
  try {
    const collaboratorExists = await db.query.collaborators.findFirst({
      where: (c, { eq }) =>
        and(eq(c.workspaceId, task.workspaceId), eq(c.userId, task.assignedTo)),
    });

    if (!collaboratorExists) {
      console.log("collaborator not found");
      return { data: null, error: "Collaborator not found" };
    } else {
      task.assignedTo = collaboratorExists.id;
      const result = await db.insert(tasks).values(task);
      revalidatePath(`/workspaces/${task.workspaceId}/tasks`);
      return { data: { result, collaboratorExists }, error: null };
    }
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const getTaskByWorkspaceId = async (workspaceId: string) => {
  try {
    // if (!workspaceId) return {data:null,error:"Workspace id not found"};
    const tasksList = await db
      .select({
        task: tasks,
        collaborator: collaborators,
        user: users,
      })
      .from(tasks)
      .where(eq(tasks.workspaceId, workspaceId))
      .innerJoin(collaborators, eq(tasks.assignedTo, collaborators.id))
      .innerJoin(users, eq(collaborators.userId, users.id));

    const nested = tasksList.map((row) => ({
      ...row.task,
      collaborator: {
        ...row.collaborator,
        user: {
          ...row.user,
        },
      },
    }));

    return { data: nested, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};

export const getTaskDetails = async (taskId: string) => {
  try {
    // if (!workspaceId) return {data:null,error:"Workspace id not found"};
    const taskDetails = await db.query.tasks.findFirst({
      where: (t, { eq }) => eq(t.id, taskId),
      with: {
        collaborators: {
          with: {
            user: true,
          },
        },
        createdByUser: true,
      },
    });

    return taskDetails;
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};

// update task
export const updateTask = async (task: Partial<tasksTypes>, taskId: string) => {
  try {
    const result = await db.update(tasks).set(task).where(eq(tasks.id, taskId));
    revalidatePath(`/workspaces/${task.workspaceId}/tasks`);
    return { data: result, error: null };
  } catch (error) {
    console.log("error", error);
    return { data: null, error: error };
  }
};

// get collaborators by workspaceId

export const getCollaboratorsByWorkspaceId = async (workspaceId: string) => {
  try {
    const collaboratorsList = await db.query.collaborators.findMany({
      where: (c, { eq }) => eq(c.workspaceId, workspaceId),
      with: {
        user: true,
      },
    });
    return { data: collaboratorsList, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};
