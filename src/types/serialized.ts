/**
 * Serialized types for passing data from Server Components to Client Components.
 * Date fields are converted to ISO strings via JSON.parse(JSON.stringify()).
 */

export interface SerializedRetro {
  id: string;
  title: string;
  status: string;
  location: string | null;
  photoUrl: string | null;
  date: string;
  createdBy: string;
  statsCache: string | null;
  startedAt: string | null;
  completedAt: string | null;
  totalDurationSec: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedCategory {
  id: string;
  retroId: string;
  name: string;
  icon: string | null;
  sortOrder: number;
  color: string | null;
}

export interface SerializedActionItem {
  id: string;
  retroId: string;
  cardId: string | null;
  text: string;
  assigneeId: string | null;
  assigneeName: string | null;
  status: string;
  createdAt: string;
}

export interface SerializedPrediction {
  id: string;
  retroId: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  text: string;
  stake: string | null;
  challengedUserId: string | null;
  challengedUserName: string | null;
  status: string;
  deadline: string | null;
  resolvedInRetroId: string | null;
  retroTitle?: string;
  resolvedInRetroTitle?: string;
  createdAt: string;
}

export interface SerializedCard {
  id: string;
  retroId: string;
  categoryId: string;
  authorId: string;
  text: string;
  imageKey: string | null;
  sortOrder: number;
  groupLabel: string | null;
  isDiscussed: boolean;
  isSkipped: boolean;
  discussionNotes: string | null;
  discussionStartedAt: string | null;
  discussionEndedAt: string | null;
  discussionDurationSec: number | null;
  carriedFromRetroId: string | null;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorColor: string;
  authorImage: string | null;
}
