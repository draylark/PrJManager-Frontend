import axios, { AxiosResponse } from "axios";
import { TaskType, ProjectType } from "../../store/types/stateTypes";
import { Dispatch, SetStateAction } from "react";
import { ProjectValues } from "../components/modals/ProjectModal";
import { TaskValues } from "../components/modals/TaskModal";
import { ClientValues } from "../components/modals/ClientModal";
import { EventValues } from "../components/modals/EventModal";
const backendUrl = import.meta.env.VITE_BACKEND_URL


interface TaskOption {
    value: string;
    label: string;
  }

type SetTaskOptionsType = Dispatch<SetStateAction<TaskOption[]>>;


interface ResponseData {
    // Define las propiedades que esperas en la respuesta
    status: number;
    data: object; // O un tipo más específico
    //...
}


export const postNewProject = async (project: ProjectValues): Promise<AxiosResponse<ResponseData>> => {
    const token = localStorage.getItem('x-token')
    return axios.post(`${backendUrl}/projects/create-project`, project, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).catch((error) => {
            console.error(error);
            return error
        }
    );
}


export const postNewTask = async ( task: TaskValues): Promise<AxiosResponse<ResponseData>> => {
    const token = localStorage.getItem('x-token')
    console.log(token)
    return axios.post(`${backendUrl}/tasks/`, task, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).catch((error) => {
            console.error(error);
            return error
        }
    );
}


export const postNewClient = async (client: ClientValues): Promise<AxiosResponse<ResponseData>> => {
    const token = localStorage.getItem('x-token')
    return axios.post(`${backendUrl}/client/`, client, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).catch((error) => {
            console.error(error);
            return error
        }
    );
}


export const postNewEvent = async (event: EventValues): Promise<AxiosResponse<ResponseData>> => {
    const token = localStorage.getItem('x-token')
    return axios.post(`${backendUrl}/event/`, event, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'  
            }
        }).catch((error) => {
            console.error(error);
            return error
        }
    );
}


export const handleProjectChange = (value: unknown, setTaskOptions: SetTaskOptionsType, projects: ProjectType[], tasks: TaskType[]) => {

    const tempTaskOptions: TaskOption[] = [];

      projects.map((project) => {
        if (project.pid === value) {
            tasks.filter ((task) => task.projectId === value).map((task) => {         
                tempTaskOptions.push({ value: task.tid, label: task.name });
            })
        }
      });

    setTaskOptions(tempTaskOptions);
};

