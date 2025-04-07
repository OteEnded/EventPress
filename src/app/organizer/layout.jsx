import OrganizerNavbar from "@/ui/components/OrganizerNavbar";
import { AuthProvider } from "@/ui/providers/AuthProvider";
import { ThemeProvider } from "@/ui/providers/ThemeProvider";

import User from "@/lib/models/User";

// export const metadata = {
//   title: "EventPress",
//   description: "",
// };

export default async function OrganizerLayout({ children }) {
    return (
        <>
            <ThemeProvider>
                <AuthProvider>
                    {/* navbar */}
                    <OrganizerNavbar />
                    {children}
                </AuthProvider>
            </ThemeProvider>
        </>
    );
}
