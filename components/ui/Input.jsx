export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
      />
    </div>
  );
}