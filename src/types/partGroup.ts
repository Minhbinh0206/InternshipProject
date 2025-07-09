import type PartItem from "./part";

export default interface PartGroup {
  id: string;
  name: string;
  optional: boolean;
  parts: PartItem[];
}