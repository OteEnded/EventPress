import { ThemeProvider } from "../ui/providers/ThemeProvider"; // Import ThemeProvider, Theme Context
import { cookies } from "next/headers";
import "./globals.css";

export const metadata = {
  title: "EventPress",
  description: "",
};

export default function RootLayout({ children }) {

  const themeCookie = cookies().get("theme"); // Get cookie object
  const theme = themeCookie ? themeCookie.value : "light"; // Extract value safely

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
