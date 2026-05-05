const getColorFromId = (id = '') => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-purple-500', 'bg-pink-500', 'bg-yellow-500',
    'bg-indigo-500', 'bg-teal-500'
  ];

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name = 'User') => {
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const UserAvatar = ({ name, userId, online }) => {
  const bgColor = getColorFromId(userId);

  return (
    <div className="relative">
      <div className={`${bgColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm`}>
        {getInitials(name)}
      </div>

      {online && (
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
      )}
    </div>
  );
};

export default UserAvatar;