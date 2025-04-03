import OrganizerNavbar from "@/ui/components/OrganizerNavbar";

import User from "@/lib/models/User";

// export const metadata = {
//   title: "EventPress",
//   description: "",
// };

export default async function OrganizerLayout({ children }) {
    
    return (
        <>
            {/* navbar */}
            <OrganizerNavbar />
            {children}
        </>
    );
}
