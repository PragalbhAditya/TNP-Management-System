import mongoose, { Schema, Document } from 'mongoose';

export type AuditAction =
    | 'USER_APPROVED'
    | 'USER_REVOKED'
    | 'USER_PROMOTED'
    | 'USER_DEMOTED'
    | 'USER_BLOCKED'
    | 'USER_UNBLOCKED'
    | 'USER_DELETED'
    | 'USER_REGISTERED'
    | 'USER_UPDATED'
    | 'DRIVE_CREATED'
    | 'DRIVE_UPDATED'
    | 'DRIVE_DELETED'
    | 'APPLICATION_SUBMITTED'
    | 'PLACEMENT_STATUS_CHANGED'
    | 'ADMIN_LOGIN'
    | 'NOTICE_CREATED'
    | 'NOTICE_UPDATED'
    | 'NOTICE_DELETED'
    | 'PASSWORD_RESET';

export interface IAuditLog extends Document {
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
    createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
    {
        action: { type: String, required: true },
        performedBy: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
            role: { type: String, required: true },
        },
        targetUser: {
            id: String,
            name: String,
            email: String,
            role: String,
        },
        details: { type: String },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

// Index for fast queries
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ 'performedBy.id': 1 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
