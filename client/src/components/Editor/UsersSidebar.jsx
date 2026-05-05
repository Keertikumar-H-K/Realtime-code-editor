import React from 'react';
import { Avatar } from '../Common/Avatar';
import { Badge } from '../Common/Badge';

export const UsersSidebar = ({ users = [], currentUser = null }) => {
  const sortedUsers = [
    ...users.filter((u) => u.id === currentUser?.uid),
    ...users.filter((u) => u.id !== currentUser?.uid),
  ];

  const onlineUsers = users.filter((u) => u.online).length;
  const totalUsers = users.length;

  return (
    <div className="flex flex-col h-full bg-brand-card border-r border-brand-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-brand-border">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Collaborators
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="success" size="xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-success" />
            </span>
            {onlineUsers} Online
          </Badge>
          <span className="text-slate-500">{totalUsers} Total</span>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {sortedUsers.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <p className="text-sm">No users yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedUsers.map((user) => {
              const isCurrentUser = user.id === currentUser?.uid;
              return (
                <div
                  key={user.id}
                  className="px-3 py-2 rounded-lg hover:bg-brand-border/30 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name={user.name}
                        size="sm"
                        online={user.online}
                      />
                      {isCurrentUser && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-purple rounded-full border border-brand-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name}
                        {isCurrentUser && <span className="text-xs text-slate-400"> (you)</span>}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.online ? (
                          <span className="text-status-success">● Online</span>
                        ) : (
                          <span className="text-slate-600">● Offline</span>
                        )}
                      </p>
                    </div>
                    {user.online && (
                      <div className="w-2 h-2 bg-status-success rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-brand-border bg-black/20">
        <div className="text-xs text-slate-500 space-y-1">
          <p>💡 Tip: Your cursor is visible to others</p>
          <p>⌨️ Changes sync in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default UsersSidebar;
