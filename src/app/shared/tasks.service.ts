import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";

export interface Task {
    id?: string;
    title: string;
    date?: string;
}
interface CreateResponse {
    name: string;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
    static url = 'https://angualr-organizer-calendar-default-rtdb.firebaseio.com/tasks'

    constructor(private httpClient: HttpClient) {

    }

    load(date: moment.Moment): Observable<Task[]> {
        return this.httpClient
            .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
            .pipe(map(tasks => {
                if (!tasks) {
                    return [];
                }
                return Object.keys(tasks).map(key => ({ ...tasks[key], id: key }))
            }))
    }

    create(task: Task): Observable<Task> {
        return this.httpClient.post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
            .pipe(map(res => {
                console.log('Response', res);
                return { ...task, id: res.name };
            }))
    }
    remove(task: Task) {
        return this.httpClient.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
    }
}

