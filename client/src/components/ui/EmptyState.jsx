export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>}
      {action}
    </div>
  );
}
