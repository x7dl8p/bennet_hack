export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export interface ChartDataPoint {
  timestamp: Date;
  value: number;

  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface ChartApiResponse {
  datasetId: string;
  data: ChartDataPoint[];
}

export interface DatasetInfo {
  id: string;
  name: string;
  description: string;
}

export interface DatasetListApiResponse {
  datasets: DatasetInfo[];
}

export interface ExampleApiResponse {
  id: number;
  name: string;
  data: any;
}
