import mongoose, { Schema, Model } from 'mongoose';

export interface IActivityLog {
  _id: string;
  userId: string;
  action: string;
  entityType: 'project' | 'task' | 'user' | 'invitation';
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ['project', 'task', 'user', 'invitation'],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
