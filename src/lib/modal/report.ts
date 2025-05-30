// Report Related Interfaces
import {RichText} from "@/lib/modal/rich-text";

export interface MailReportItem {
  id: number;
  message_id: string;
  thread_id: string;
  receive_at: string;
  sender: string;
  subject: string;
  summary: string;
  category: "Essential" | "NonEssential";
  tags: string[];
  action: "Read" | "Delete" | "Reply" | "Ignore";
  action_result: "Success" | "Error" | null;
  reply_message: string | null;
}

export interface ReportModel {
  messages_in_queue?: Record<string, number>;  // Fixed from list<string, number>
  summary?: RichText[];
  content?: ReportContent;
}

export interface ReportContent {
  content_source: string[];
  gmail: MailMessagesByAccount[];
  outlook: MailMessagesByAccount[];
}

export interface MailMessagesByAccount {
  account_id: string;
  email: string;
  messages: MailReportItem[];
}

export interface Report {
  id: string;
  type: "Realtime" | "Previous";
  content: ReportModel;
  status: "Appending" | "Finalized";
  created_at: string;
  finalized_at: string | null;
  last_updated_at: string | null;
}
