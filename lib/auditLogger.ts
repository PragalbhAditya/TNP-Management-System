import dbConnect from '@/lib/dbConnect';
import AuditLog, { AuditAction } from '@/models/AuditLog';

interface LogParams {
    action: AuditAction;
    performedBy: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    targetUser?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    details?: string;
    metadata?: Record<string, any>;
}

/**
 * Write an audit log entry. Call this from API routes after successful
 * state-changing operations. Errors are swallowed so logging never
 * breaks the main request.
 */
export async function writeAuditLog(params: LogParams): Promise<void> {
    try {
        await dbConnect();
        await AuditLog.create(params);
    } catch (err) {
        // Never let audit failures crash the main flow
        console.error('[AuditLog] Failed to write log entry:', err);
    }
}
