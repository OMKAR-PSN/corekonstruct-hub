import { delay } from "./utils";

export type Worker = {
  id: number;
  name: string;
  initials: string;
};

export type MaterialRequest = {
  id: number;
  item: string;
  quantity: number;
  unit: string;
  status: "Pending" | "Approved" | "Delivered";
};

export type ProgressNote = {
  id: number;
  date: string;
  weather: string;
  stage: string;
  workDone: string;
  issues: string;
};

const workers: Worker[] = [
  { id: 1, name: "Ramesh K.", initials: "RK" },
  { id: 2, name: "Suresh P.", initials: "SP" },
  { id: 3, name: "Mahesh B.", initials: "MB" },
  { id: 4, name: "Pradeep N.", initials: "PN" },
  { id: 5, name: "Vijay S.", initials: "VS" },
  { id: 6, name: "Anand T.", initials: "AT" },
  { id: 7, name: "Ganesh L.", initials: "GL" },
  { id: 8, name: "Dinesh R.", initials: "DR" },
];

const materialRequests: MaterialRequest[] = [
  { id: 1, item: "Cement OPC 53", quantity: 120, unit: "bags", status: "Approved" },
  { id: 2, item: "River Sand", quantity: 8, unit: "cu.m", status: "Pending" },
  { id: 3, item: "TMT Steel 12mm", quantity: 2.5, unit: "MT", status: "Delivered" },
];

const progressSeed = {
  weatherOptions: ["Sunny", "Cloudy", "Rainy", "Windy", "Foggy"],
  stageOptions: ["Brickwork", "Plastering", "Structure", "Finishing"],
  notes: [
    {
      id: 1,
      date: "2026-04-12",
      weather: "Sunny",
      stage: "Brickwork",
      workDone: "Completed west wing brickwork up to third slab level.",
      issues: "None reported.",
    },
  ] satisfies ProgressNote[],
};

export async function getSupervisorWorkers() {
  return delay(workers);
}

export async function getMaterialRequests() {
  return delay(materialRequests);
}

export async function getProgressSeed() {
  return delay(progressSeed);
}

export { workers, materialRequests, progressSeed };
