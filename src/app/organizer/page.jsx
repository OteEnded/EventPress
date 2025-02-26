

export default async function OrganizerPage() {
  return (
    <html>
        <head>
            <title>Organizer</title>
        </head>
        <body>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg
-gradient-to-r from-gray-700 via-gray-900 to-black">
                <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                    <img
                        className="dark:invert"
                        src="/eventpress-logo.png"
                        alt="Event Press logo"
                        width={180}
                        height={38}
                    />
                    <h1 className="text-4xl font-bold text-center sm:text-left text-white">
                        Welcome to Event Press
                    </h1>
                    <p className="text-lg text-center sm:text-left text-white">
                        The ultimate platform for event organizers to create and manage their events effortlessly.
                    </p>
                    <div className="flex gap-4 items-center flex-col sm:flex-row">
                        <a
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                            href="/login"
                        >
                            Get Started
                        </a>
                        <a
                            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                            href="/learn-more"
                        >
                            Learn More
                        </a>
                    </div>
                </main>
                <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-white">
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="/about"
                    >
                        About Us
                    </a>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="/contact"
                    >
                        Contact
                    </a>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="/privacy"
                    >
                        Privacy Policy
                    </a>
                </footer>
            </div>
        </body>

    </html>
  );
}