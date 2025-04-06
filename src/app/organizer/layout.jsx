import OrganizerNavbar from "@/ui/components/OrganizerNavbar";
import { AuthProvider } from "@/ui/providers/AuthProvider";

import User from "@/lib/models/User";

// export const metadata = {
//   title: "EventPress",
//   description: "",
// };

export default async function OrganizerLayout({ children }) {
    return (
        <>
            <AuthProvider>
                {/* navbar */}
                <OrganizerNavbar />
                {children}
            </AuthProvider>
        </>
    );
}
