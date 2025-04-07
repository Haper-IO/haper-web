import {reqHandler, streamingHandler} from "@/lib/requests/client/base";
import {Report} from "@/lib/modal/report";

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

// Get the newest report
export const getNewestReport = async () => {
  return reqHandler.get<ReportResponse>('/report/newest');
};

// Generate a new report
export const generateReport = async () => {
  return reqHandler.post<ReportResponse>('/report/generate');
};

// Get report history
export const getReportHistory = async (page: number, pageSize: number) => {
  return reqHandler.get<ReportListResponse>('/report/history', {
    params: {page, page_size: pageSize}
  });
};

// Get report by ID
export const getReportById = async (reportId: string) => {
  return reqHandler.get<ReportResponse>(`/report/${reportId}`);
};

// Generate reply for a message
export interface GenerateReplyRequest {
  source: string;
  account_id: string;
  id: number;
}

export const pollMessageProcessingStatus = (reportId: string) => {
  return streamingHandler.post(`/report/${reportId}/message-processing-status`);
}

export const generateReply = (reportId: string, request: GenerateReplyRequest, abortController?: AbortController) => {
  return streamingHandler.post(`/report/${reportId}/generate-reply`, request, {
    signal: abortController?.signal,
  });
};

// Define interfaces for batch update
export interface ItemUpdateInfo {
  id: string | number; // Item id (numeric or string)
  category?: string | null;   // Updated category
  action?: "Read" | "Delete" | "Reply" | "Ignore" | null; // Updated action
  reply_message?: string | null; // Reply message for Reply action
}

export interface BatchUpdateRequest {
  gmail?: Record<string, ItemUpdateInfo[]>;
  outlook?: Record<string, ItemUpdateInfo[]>;
}

// Update report with batched actions
export const updateReport = async (reportId: string, updates: BatchUpdateRequest) => {
  return reqHandler.put(`/report/${reportId}`, updates)
};

// Apply batch actions to a report
export const applyReportActions = async (reportId: string) => {
  return reqHandler.post<BatchActionResponse>(`/report/${reportId}/batch-action`);
};

export const pollBatchActionStatus = (reportId: string) => {
  return streamingHandler.post(`/report/${reportId}/batch-action-status`);
}
