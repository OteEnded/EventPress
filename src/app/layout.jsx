import { ThemeProvider } from "../ui/providers/ThemeProvider"; // Import ThemeProvider, Theme Context
import { cookies } from "next/headers";
import "./globals.css";

// export const metadata = {
//   title: "EventPress",
//   description: "",
// };

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = themeCookie ? themeCookie.value : "light";


  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
