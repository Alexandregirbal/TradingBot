export interface RequestType {
  data: any; //TODO more precise
  endPoint: string;
  type: "GET" | "POST" | "PUT" | "DELETE";
}
