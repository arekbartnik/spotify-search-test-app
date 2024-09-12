"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface BoxProps {
	id: string;
	name: string;
	type: string;
	imageUrl: string;
}

export function Box({ id, name, type, imageUrl }: BoxProps) {
	return (
		<div className="overflow-hidden relative rounded-lg shadow-md bg-white">
			<Image
				src={imageUrl}
				alt={name}
				width={400}
				height={400}
				className="w-full aspect-[4/3] object-cover object-top rounded-b-lg"
			/>
			<div className="p-4">
				<div className="flex justify-between items-start">
					<h3 className="font-bold">
						<Link
							href={`/${type}/${id}`}
							className={cn(
								"before:content-[''] before:absolute before:inset-0 before:bg-zinc-100 before:opacity-0 hover:before:opacity-20 before:transition-opacity before:duration-300",
							)}
						>
							{name}
						</Link>
					</h3>
				</div>
				<p className="text-sm text-muted-foreground capitalize">
					{type}
				</p>
			</div>
		</div>
	);
}
