import { reqHandler } from "@/lib/requests/client/base";

// Rich Text Related Interfaces
// interface Annotation {
//   bold: boolean;
// }

interface TextContent {
  content: string;
}

interface EmailContent {
  name: string;
  address: string;
}

interface RichText {
  type: "text" | "email";
  text?: TextContent;
  email?: EmailContent;
  // annotations: Annotation;
  // plain_text: string;
}

// Report Related Interfaces
interface MailReportItem {
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
}

export interface ReportModel {
  messages_in_queue: Record<string, number>;  // Fixed from list<string, number>
  summary: RichText[];
  content: ReportContent;
}

interface ReportContent {
  content_source: string[];
  gmail: MailMessagesByAccount[];
  outlook: MailMessagesByAccount[];
}

interface MailMessagesByAccount {
  account_id: string;
  email: string;
  messages: MailReportItem[];
}

export interface Report {
  id: string;
  content: ReportModel;
  // status: "Appending" | "Finalized";
  created_at: string;
  finalized_at: string | null;
}

export interface ReportResponse {
  report: Report | null;
}

export interface ReportListResponse {
  reports: Report[];
  total_page: number;
}

export interface BatchActionResponse {
  run_id: string;
}

export interface BatchActionStatus {
  total: number;
  succeed: number;
  failed: number;
  status: "Waiting" | "Ongoing" | "Done";
  logs: string[];
}

// Get the newest report
export const getNewestReport = async () : Promise<{ report: Report | null }> => {
  return reqHandler.get<ReportResponse>('/report/newest');
};

// Generate a new report
export const generateReport = async (): Promise<{ report: Report | null }> => {
  return reqHandler.post<ReportResponse>('/report/generate');
};

// Get report history
export const getReportHistory = async (page?: number, pageSize?: number) : Promise<{ reports: Report[], total_page: number }> => {
  return reqHandler.get<ReportListResponse>('/report/history', {
    params: { page, page_size: pageSize }
  });
};

// Get report by ID
export const getReportById = async (reportId: string) : Promise<{ report: Report | null }> => {
  return reqHandler.get<ReportResponse>(`/report/${reportId}`);
};

// Get message processing status for a report
export const getReportProcessingStatus = async (reportId: string) => {
  const response = await fetch(`/api/v1/report/${reportId}/message-processing-status`, {
    headers: {
      // Add your auth headers here
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get processing status');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  return reader;
};

// Apply batch actions to a report
export const applyReportActions = async (reportId: string) => {
  return reqHandler.post<BatchActionResponse>(`/report/${reportId}/batch-action`);
};

// Get batch action status
export const getBatchActionStatus = async (reportId: string) => {
  const response = await fetch(`/api/v1/report/${reportId}/batch-action-status`, {
    headers: {
      // Add your auth headers here
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get batch action status');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  return reader;
};

// Generate reply for a message
export interface GenerateReplyRequest {
  source: string;
  account_id: string;
  id: string;
}

export const generateReply = async (reportId: string, request: GenerateReplyRequest) => {
  const response = await fetch(`/api/v1/report/${reportId}/generate-reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error('Failed to generate reply');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  return reader;
};
// Update email action in a report
export interface UpdateEmailActionRequest {
  source: string;
  account_id: string;
  message_id: string;
  action: "Read" | "Delete" | "Reply" | "Ignore" | null;
}

export const updateEmailAction = async (reportId: string, request: UpdateEmailActionRequest): Promise<boolean> => {
  try {
    const response = await fetch(`/api/v1/report/${reportId}/update-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating email action:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateEmailAction:", error);
    return false;
  }
};

// Define interfaces for batch update
export interface ItemUpdateInfo {
  id: string | number; // Item id (numeric or string)
  category?: string;   // Updated category
  action?: "Read" | "Delete" | "Reply" | "Ignore" | null; // Updated action
  reply_message?: string; // Reply message for Reply action
}

export interface BatchUpdateRequest {
  gmail?: Record<string, ItemUpdateInfo[]>;
  outlook?: Record<string, ItemUpdateInfo[]>;
}

// Update report with batched actions
export const updateReportActions = async (updates: BatchUpdateRequest): Promise<boolean> => {
  try {
    console.log("Updating report with batch request:", updates);
    
    const response = await fetch(`/api/v1/report/generate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating report actions:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateReportActions:", error);
    return false;
  }
};

