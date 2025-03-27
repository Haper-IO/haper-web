import { reqHandler } from "@/lib/requests/client/base";

export interface ReportModel {
  // You'll need to define the content structure based on your needs
  [key: string]: any;
}

export interface Report {
  id: string;
  content: ReportModel;
  status: "Appending" | "Finalized";
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
export const getNewestReport = async () => {
  return reqHandler.get<ReportResponse>('/report/newest');
};

// Generate a new report
export const generateReport = async () => {
  return reqHandler.post<ReportResponse>('/report/generate');
};

// Get report history
export const getReportHistory = async (page = 1, pageSize = 10) => {
  return reqHandler.get<ReportListResponse>('/report/history', {
    params: { page, page_size: pageSize }
  });
};

// Get report by ID
export const getReportById = async (reportId: string) => {
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
