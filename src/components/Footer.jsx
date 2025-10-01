export default function Footer() {
  return (
    <footer className="bg-gray-200 text-center py-4 mt-6 border-t">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} Cricket League Management System
      </p>
    </footer>
  );
}
