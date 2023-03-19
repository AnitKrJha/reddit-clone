import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "Public" | "Restricted" | "Private";
  createdAt?: Timestamp;
  imageUrl?: string;
}
