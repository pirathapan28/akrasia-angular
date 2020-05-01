export class User {
    _id?: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    stats: Stats;
    settings: UserSettings;
    achieves: number;
    weekly_stats: weekly;
}

export class UserForm {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    projects: string[];
    stats: Stats;
    settings: UserSettings;
    achieves: number;
    weekly_stats: weekly;
}

//stats member of user, to contain leaderboard info
export class Stats {
    num_projects_created : number;
    num_projects_finished_early : number;
    num_projects_finished_late : number;
    total_time_worked : number;
  }

//stats member for weekly time to contain in leaderboard info
export class weekly {
    weekly_projects_created : number;
    weekly_projects_finished_early : number;
    weekly_projects_finished_late : number;
    weekly_time_worked : number;
}

  //settings member of user, to manage personal scheduling settings
export class UserSettings {
    schedule_off: number;
    off_length: number;
    day_off1: number;
    day_off2: number;
}

export class Project {
    extendedProperties: {
        shared: {
            akrasia: boolean;
            urgency_level: number;
            importance_level: number;
            percentage: number;
            due_date: string;
            estimated_time: number;
            time_worked: number;
        }
    }
    summary: string;
    description: string;
    start: {
        dateTime: string;
    }
    end: {
        dateTime: string;
    }
    reminders: {
        useDefault: boolean,
        overrides: [
          {method: string, minutes: number},
          {method: string, minutes: number}
        ]
    };
    colorId: number;
}
