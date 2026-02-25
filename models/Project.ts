import mongoose, { Schema, Model } from 'mongoose';
import { IProject } from '@/types/project';

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      ref: 'User',
    },
    members: [
      {
        userId: {
          type: String,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['admin', 'member'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ members: 1 });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
