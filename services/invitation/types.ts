import { InvitationStatus } from "@prisma/client";

export interface UserInfo {
  id: string;
  email: string;
  name: string | null;
}

export interface BoardInfo {
  id: string;
  name: string;
}

export interface BoardWithOwnerName {
  id: string;
  name: string;
  ownerName: string
}

export interface BoardWithOwner {
  id: string;
  name: string;
  description: string | null;
  owner: UserInfo;
}

export interface CreateInvitationDTO {
  boardId: string;
  invitedUserId: string;
}

export interface RespondToInvitationDTO {
  response: "ACCEPTED" | "REJECTED";
}

export interface InvitationResponse {
  id: string;
  boardId: string;
  userId: string;
  status: InvitationStatus;
  invitedAt: Date;
  respondedAt: Date | null;
  user: UserInfo;
  board: BoardInfo;
}

export interface InvitationBasicResponse {
  id: string;
  boardId: string;
  userId: string;
  status: InvitationStatus;
  invitedAt: Date;
  respondedAt: Date | null;
}

export interface UserInvitationResponse {
  id: string;
  userId: string;
  status: InvitationStatus;
  board: BoardWithOwnerName;
}

export interface BoardInvitationResponse {
  id: string;
  boardId: string;
  userId: string;
  status: InvitationStatus;
  invitedAt: Date;
  respondedAt: Date | null;
  user: UserInfo;
}
