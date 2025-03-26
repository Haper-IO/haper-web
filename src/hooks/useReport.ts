import { reqHandler } from "@/lib/requests/server/base";
import { useState, useEffect } from "react";
import {
  GET_NEWEST_APPENDING_REPORT_URI,
  POST_GENERATE_REPORT_URI,
  GET_REPORT_HISTORY_URI,
  POST_APPLY_REPORT_ACTION_URI
} from "@/hooks/base";

// Define the types for the report structure
interface RichTextAnnotation {
  bold?: boolean;
}

interface RichTextBase {
  type: "text" | "email";
  annotations?: RichTextAnnotation;
  plain_text?: string;
}

interface TextRichText extends RichTextBase {
  type: "text";
  text: {
    content: string;
  };
}

interface EmailRichText extends RichTextBase {
  type: "email";
  email: {
    name: string;
    address: string;
  };
}

type RichText = TextRichText | EmailRichText;

interface MailReportItem {
  id: number;
  message_id: string;
  thread_id: string;
  received_at: string;
  sender: string;
  subject: string;
  summary: string;
  category: "Essential" | "NonEssential";
  tags: string[];
  action: "Read" | "Delete" | "Reply" | "Ignore";
  action_result?: "Success" | "Error";
}

interface MailMessagesByAccount {
  account_id: string;
  email: string;
  messages: MailReportItem[];
}

interface ReportContent {
  content_sources: string[];
  messages_in_queue?: Record<string, number>;
  [key: string]: MailMessagesByAccount[] | string[] | Record<string, number> | undefined;
}

interface Report {
  id: string;
  content: {
    summary: RichText[];
    content: ReportContent;
  };
  status: "Appending" | "Finalized";
  created_at: string;
}

interface ReportResponse {
  uri: string;
  elapsed: number;
  status: number;
  message: string;
  data: {
    report: Report | null;
  };
}

interface ReportHistoryResponse {
  uri: string;
  elapsed: number;
  status: number;
  message: string;
  data: {
    reports: Report[];
  };
}

export function useReport() {
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [historyReports, setHistoryReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the newest appending report
  const fetchNewestReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reqHandler.get<ReportResponse>(GET_NEWEST_APPENDING_REPORT_URI);
      if (response.data?.data?.report) {
        setCurrentReport(response.data.data.report);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch newest report');
      console.error('Error fetching newest report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate a new report
  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reqHandler.post<ReportResponse>(POST_GENERATE_REPORT_URI);
      if (response.data?.data?.report) {
        setCurrentReport(response.data.data.report);
        return response.data.data.report;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      console.error('Error generating report:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch report history
  const fetchReportHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reqHandler.get<ReportHistoryResponse>(GET_REPORT_HISTORY_URI);
      if (response.data?.data?.reports) {
        setHistoryReports(response.data.data.reports);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report history');
      console.error('Error fetching report history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply actions to a report
  const applyReportAction = async (reportId: string, actions: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reqHandler.post(POST_APPLY_REPORT_ACTION_URI, {
        report_id: reportId,
        actions
      });
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply report action');
      console.error('Error applying report action:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  return {
    currentReport,
    historyReports,
    loading,
    error,
    fetchNewestReport,
    generateReport,
    fetchReportHistory,
    applyReportAction,
    clearError
  };
}


