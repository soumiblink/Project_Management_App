import { Server as SocketIOServer } from 'socket.io';

// Get the global Socket.io instance
export const getIO = (): SocketIOServer | null => {
  if (typeof global !== 'undefined' && (global as any).io) {
    return (global as any).io;
  }
  return null;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  } else {
    console.log('Socket.io not available, skipping emit to user');
  }
};

export const emitToProject = (projectId: string, event: string, data: any) => {
  const io = getIO();
  if (io) {
    io.to(`project:${projectId}`).emit(event, data);
  } else {
    console.log('Socket.io not available, skipping emit to project');
  }
};
