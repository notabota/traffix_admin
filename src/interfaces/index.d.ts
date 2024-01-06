export interface IRecord {
    id: string;
    name: string;
}

export interface ICamera {
    id: string;
    name: string;
    lat: number;
    lng: number;
    counting_state: boolean;
    url: string;
    type: string;
    description: string;
    record?: IRecord;
}
