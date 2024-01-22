"use server";
import {IFetchPaginationParams} from "@/app/api/domain/entities/pagination";
import {TasksDatasourcesImpl} from "@/app/api/infrastructure/datasources/tasksDatasourcesImpl";
import {TasksRepositoryImpl} from "@/app/api/infrastructure/repositories/tasksRepositoryImpl";
import {getListUsers} from "@/actions/auth/getlistUsers";

export const getPaginationTasks = async ({
    creatorUserId,
    assigneeUserId,
    pageSize,
    pageNumber,
}: IFetchPaginationParams) => {
    if (isNaN(Number(pageNumber))) pageNumber = 1;
    if (pageNumber < 1) pageNumber = 1;

    try{
        const tasksDatasource = new TasksDatasourcesImpl();
        const tasksRespository = new TasksRepositoryImpl(tasksDatasource);
        const tasks = await tasksRespository.getListForum({creatorUserId, assigneeUserId, pageSize, pageNumber});
        const users = await getListUsers();

        const tasksWithCreatorName = tasks.items.map(task => {
            const creatorUser = users.users.find(user => user.uuid === task.creatorUserId);
            const assigneeName = users.users.find(user => user.uuid === task.assigneeUserId)?.name;
            return {
                ...task,
                userNameCreator: creatorUser ? creatorUser.name : 'Desconocido',
                assigneeName: assigneeName ? assigneeName : 'Desconocido',
            };
        });

        return {
            currentPage: tasks.currentPage,
            totalPages: tasks.totalPages,
            tasks: tasksWithCreatorName,
        };

    } catch (error) {
        console.error("Error loading tasks:", error);
        throw new Error("No se pudo cargar las tareas: " + (error as Error));
    }
}
