import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
});

export const metadata: Metadata = {
	title: "Spotify Search Test App",
	description: "Spotify Search Test App",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Providers>
			<html lang="en" className={`${montserrat.variable}`}>
				<body className="font-montserrat antialiased flex flex-col min-h-screen">
					<div className="container max-w-screen-lg mx-auto p-4 pb-6 md:p-8 flex-grow">
						<Header />
						{children}
					</div>
					<Footer />
					<Toaster position="top-center" duration={2000} />
				</body>
			</html>
		</Providers>
	);
}
