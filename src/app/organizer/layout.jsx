import OrganizerNavbar from "@/ui/components/OrganizerNavbar";

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
