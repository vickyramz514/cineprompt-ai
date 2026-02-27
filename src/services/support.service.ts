import { api, getErrorMessage } from "@/lib/api";

export type SupportTicket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
  messages?: SupportMessage[];
};

export type SupportMessage = {
  id: string;
  sender: string;
  message: string;
  createdAt: string;
};

export async function createTicket(data: {
  subject: string;
  message: string;
  priority?: string;
}) {
  const res = await api.post<{ success: boolean; data: SupportTicket }>(
    "/support/ticket",
    data
  );
  if (!res.data.success) throw new Error("Failed to create ticket");
  return res.data.data;
}

export async function getTickets(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const res = await api.get<{
    success: boolean;
    data: { tickets: SupportTicket[]; total: number };
  }>("/support/tickets", { params });
  if (!res.data.success) throw new Error("Failed to fetch tickets");
  return res.data.data;
}

export async function getTicketById(id: string) {
  const res = await api.get<{ success: boolean; data: SupportTicket }>(
    `/support/tickets/${id}`
  );
  if (!res.data.success) throw new Error("Failed to fetch ticket");
  return res.data.data;
}

export async function addMessage(ticketId: string, message: string) {
  const res = await api.post<{ success: boolean; data: SupportMessage }>(
    `/support/tickets/${ticketId}/message`,
    { message }
  );
  if (!res.data.success) throw new Error("Failed to send message");
  return res.data.data;
}

export { getErrorMessage };
