// API Request/Response types
export interface CreateEventRequest {
  tenant: string;
  feature: string;
  tokens: number;
}

export interface CreateEventResponse {
  success: boolean;
  eventId: string;
}

export interface UsageResponse {
  tenant: string;
  tenantName: string;
  totalTokens: number;
  monthlyQuota: number;
  quotaPercent: number;
  periodStart: string;
  periodEnd: string;
}

export interface TenantUsageData {
  id: string;
  name: string;
  totalTokens: number;
  monthlyQuota: number;
  quotaPercent: number;
}

// Queue job types
export interface EventJob {
  eventId: string;
  tenantId: string;
  feature: string;
  tokens: number;
  createdAt: string;
}

// Webhook payload
export interface SlackWebhookPayload {
  text: string;
}
