import Event from "@/lib/models/Event";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth-options";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import RefreshButton from "@/ui/components/RefreshButton";

// This function sets cache control headers to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrganizerDashboardPage() {
	// Force headers evaluation to ensure no caching
	headers();
	
	const session = await getServerSession(authOptions);

	// if !session redirect to root
	if (!session) {
		redirect("/");
	}

	const user = await User.getUserByIdentityEmail(session.user.email);
	const event_of_user = await Event.getEventsOfUser(user.user_id);
	
	// Check if user is system admin
	const isSystemAdmin = user.SystemAdmin !== null;
	// console.log("isSystemAdmin", isSystemAdmin);

	function get_events(organize) {
		let result = [];
		for (let event of organize.events) {
			result.push(
					<div 
						key={event.event_id} 
						className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
					>
						{/* Event Image Banner - Handle base64 or use placeholder */}
						<div className="h-32 overflow-hidden">
							{event.banner ? (
								<img
									src={event.banner}
									alt={`${event.name} banner`}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="h-full w-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
									<span className="text-3xl">🎭</span>
								</div>
							)}
						</div>
						<div className="p-5">
							<h3 className="text-xl font-semibold mb-2 truncate">{event.name}</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
								{event.description || "ไม่มีคำอธิบาย"}
							</p>
							<div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
								<span className="mr-2">📅</span>
								{event.start_date && event.end_date ? (
									<span>
										{new Date(event.start_date).toLocaleDateString('th-TH')} - {new Date(event.end_date).toLocaleDateString('th-TH')}
									</span>
								) : (
									<span>{event.start_date ? new Date(event.start_date).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
								)}
							</div>
							<Link 
								href={`/organizer/${organize.organizer.organizer_id}/event/${event.id_name || event.event_id}`}
								className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition w-full text-center"
							>
								จัดการอีเวนต์
							</Link>
						</div>
					</div>
			);
		}
		return result;
	}

	function get_organizes() {
		let result = [];
		for (let organize of event_of_user) {
			result.push(
				<div key={`${organize["organizer"]["organizer_id"]}`} className="mb-12">
					<div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
							<div className="flex items-center mb-4 md:mb-0 max-w-[75%]">
								{/* Organizer Logo - Handle base64 or use placeholder */}
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 overflow-hidden flex-shrink-0">
									{organize.organizer.logo ? (
										<img 
											src={organize.organizer.logo} 
											alt={`${organize.organizer.name} logo`} 
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-2xl text-blue-600 dark:text-blue-400">🏢</span>
									)}
								</div>
								
								<div className="overflow-hidden">
									<h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
										{organize.organizer.name}
									</h2>
									<p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
										{organize.organizer.description || "ไม่มีคำอธิบายองค์กร"}
									</p>
									{/* Approval Status Badge */}
									<span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${organize.organizer.approver ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
										{organize.organizer.approver ? 'ได้รับการอนุมัติ' : 'รอการอนุมัติ'}
									</span>
								</div>
							</div>
							
							<div className="flex flex-wrap gap-2">
								<Link href={`/organizer/${organize["organizer"]["organizer_id"]}`}>
									<button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md text-sm font-medium transition flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
										</svg>
										จัดการองค์กร
									</button>
								</Link>
								
								{organize.isOwner && (
									<Link href={`/organizer/${organize["organizer"]["organizer_id"]}/event/create`}>
										<button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-md text-sm font-medium transition flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
											</svg>
											สร้างอีเวนต์
										</button>
									</Link>
								)}
							</div>
						</div>
					</div>
					
					{organize.events && organize.events.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
							{get_events(organize)}
						</div>
					) : (
						<div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
							<div className="text-5xl mb-4">📅</div>
							<h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">ยังไม่มีอีเวนต์</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-6">คุณสามารถเริ่มต้นสร้างอีเวนต์แรกสำหรับองค์กรนี้</p>
							<Link href={`/organizer/${organize["organizer"]["organizer_id"]}/event/create`}>
								<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
									+ สร้างอีเวนต์แรกของคุณ
								</button>
							</Link>
						</div>
					)}
				</div>
			);
		}
		
		if (result.length === 0) {
			return (
				<div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
					<div className="text-5xl mb-4">🏢</div>
					<h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">คุณยังไม่มีองค์กรที่เกี่ยวข้อง</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">ลงทะเบียนองค์กรของคุณหรือใช้คำเชิญสตาฟเพื่อเข้าถึงองค์กรที่คุณได้รับเชิญ</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link href="/organizer/create">
							<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition w-full">
								+ ลงทะเบียนองค์กร
							</button>
						</Link>
						<Link href="/organizer/staffinvitation">
							<button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 transition w-full">
								รับคำเชิญสตาฟ
							</button>
						</Link>
					</div>
				</div>
			);
		}
		
		return result;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#5E9BD6] to-[#4A7CB0] dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 px-4 py-8 md:px-8 lg:px-12">
			{/* Header Section */}
			<header className="max-w-7xl mx-auto mb-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
							แดชบอร์ด
						</h1>
						<p className="text-gray-600 dark:text-gray-300 mt-2">
							องค์กรทั้งหมด
						</p>
					</div>
					
					<div className="flex flex-wrap gap-3 items-center">
						<RefreshButton />
						
						<Link href="/organizer/create">
							<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
								</svg>
								ลงทะเบียนองค์กร
							</button>
						</Link>
						
						<Link href="/organizer/staffinvitation">
							<button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
									<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
								</svg>
								รับคำเชิญสตาฟ
							</button>
						</Link>
					</div>
				</div>
			</header>
			
			{/* Main Content Section */}
			<main className="max-w-7xl mx-auto">
				{/* Statistics Section */}
				<section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex items-center">
						<div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 mr-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-4.419L6.581 16.814A1 1 0 015 16V4z" clipRule="evenodd" />
							</svg>
						</div>
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">องค์กรทั้งหมด</p>
							<h3 className="text-2xl font-bold text-gray-800 dark:text-white">{event_of_user.length}</h3>
						</div>
					</div>
					
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex items-center">
						<div className="rounded-full bg-green-100 dark:bg-green-900 p-4 mr-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
								<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
							</svg>
						</div>
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">อีเวนต์ทั้งหมด</p>
							<h3 className="text-2xl font-bold text-gray-800 dark:text-white">
								{event_of_user.reduce((total, org) => total + (org.events ? org.events.length : 0), 0)}
							</h3>
						</div>
					</div>
				</section>
				
				{/* Organizations & Events */}
				<section className="mb-8">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-t-xl shadow-md border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
							{isSystemAdmin ? 'องค์กรและอีเวนต์ทั้งหมด' : 'จัดการองค์กรและอีเวนต์ของคุณได้ที่นี่'}
						</h2>
					</div>
					
					<div className="bg-white/50 dark:bg-gray-800/50 rounded-b-xl p-6">
						<div className="space-y-8">
							{get_organizes()}
						</div>
					</div>
				</section>
			</main>
			
			{/* Footer */}
			<footer className="max-w-7xl mx-auto mt-12 text-center text-gray-200 dark:text-gray-400 text-sm">
				<p>© {new Date().getFullYear()} EventPress. สงวนลิขสิทธิ์.</p>
				<p className="mt-2">ติดต่อผู้ดูแลระบบ: <a href="mailto:ratnaritjumnong@gmail.com" className="font-medium text-gray-300 hover:text-blue-200 dark:text-gray-400 dark:hover:text-blue-400 underline">ratnarit.j@ku.th</a></p>
			</footer>
		</div>
	);
}
