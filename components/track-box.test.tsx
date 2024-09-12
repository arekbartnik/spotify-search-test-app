"use client";

import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TrackBox } from "./track-box";

// Mock SaveTrackButton
vi.mock("@/components/save-track-button", () => ({
	SaveTrackButton: () => <button type="button">SaveTrackButton</button>,
}));

// Mock next/image
vi.mock("next/image", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: mock
	// biome-ignore lint/a11y/useAltText: mock
	default: (props: any) => <img {...props} />,
}));

describe("TrackBox", () => {
	const mockProps = {
		id: "1",
		name: "Test Track",
		artistName: "Test Artist",
		albumName: "Test Album",
		albumCoverUrl: "https://example.com/cover.jpg",
		duration: 3 * 60 * 1000,
		albumId: "album1",
		isSaved: false,
	};

	test("renders track information correctly", () => {
		render(<TrackBox {...mockProps} />);

		expect(screen.getByText("Test Track")).toBeInTheDocument();
		expect(screen.getByText("Test Artist")).toBeInTheDocument();
		expect(screen.getAllByText("Test Album")[0]).toBeInTheDocument();
		expect(screen.getByText("3:00")).toBeInTheDocument();
	});

	test("renders album cover image", () => {
		render(<TrackBox {...mockProps} />);

		const image = screen.getByAltText("Test Album") as HTMLImageElement;
		expect(image).toBeInTheDocument();
		expect(image.src).toContain("https://example.com/cover.jpg");
	});

	test("renders album link correctly", () => {
		render(<TrackBox {...mockProps} />);

		const albumLink = screen.getAllByText("Test Album")[0].closest("a");
		expect(albumLink).toHaveAttribute("href", "/album/album1");
	});
});
