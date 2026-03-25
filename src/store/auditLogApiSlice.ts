import { apiSlice } from "./apiSlice";

/**
 * 🛰️ Robust Audit Log API Slice
 * 🏗️ Integrated with our new backend state tracking system.
 */
export interface AuditLog {
    _id: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "AUTH_FAILED" | "STATUS_CHANGE";
    resourceType: string;
    resourceId?: string;
    performedBy: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    actorName: string;
    details: {
        before?: Record<string, unknown>;
        after?: Record<string, unknown>;
        description: string;
    };
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export interface GetAuditLogsParams {
    page?: number;
    limit?: number;
    resourceType?: string;
    action?: string;
    actorId?: string;
    search?: string;
}

export interface AuditLogResponse {
    success: boolean;
    total: number;
    page: number;
    pages: number;
    logs: AuditLog[];
}

export const auditLogApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all logs with filtering & pagination
        getAuditLogs: builder.query<AuditLogResponse, GetAuditLogsParams>({
            query: (params) => ({
                url: "/api/audit-logs",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 20,
                    resourceType: params.resourceType,
                    action: params.action,
                    actorId: params.actorId,
                    search: params.search,
                }
            }),
            providesTags: ["Report"], // Consider adding a dedicated 'Audit' tag if tagTypes allow.
        }),

        // Fetch single log detail (for deep inspection of data changes)
        getAuditLogById: builder.query<{ success: boolean; log: AuditLog }, string>({
            query: (id) => `/api/audit-logs/${id}`,
        }),
    }),
});

export const {
    useGetAuditLogsQuery,
    useGetAuditLogByIdQuery
} = auditLogApiSlice;
