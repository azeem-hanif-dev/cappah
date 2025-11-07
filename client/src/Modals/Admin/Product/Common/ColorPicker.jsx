import React, { useState } from "react";
const colors = [
	{ id: 1, name: "White", hex: "#FFFFFF" },

	{ id: 2, name: "Red", hex: "#EF4444" },
	{ id: 3, name: "Green", hex: "#22C55E" },
	{ id: 4, name: "Blue", hex: "#3B82F6" },
	{ id: 5, name: "Yellow", hex: "#EAB308" },
	{ id: 6, name: "Gray", hex: "#6B7280" },

	{ id: 7, name: "Pink", hex: "#EC4899" },
	{ id: 8, name: "Black", hex: "#000000" },

	{ id: 9, name: "Purple", hex: "#A855F7" },
	{ id: 10, name: "Orange", hex: "#F97316" },
	{ id: 11, name: "Brown", hex: "#8B4513" },
	{ id: 12, name: "Cyan", hex: "#06B6D4" },
	{ id: 13, name: "Lime", hex: "#84CC16" },
	{ id: 14, name: "Teal", hex: "#14B8A6" },
	{ id: 15, name: "Magenta", hex: "#D946EF" },
	{ id: 16, name: "Dark Blue", hex: "#1E3A8A" },
	{ id: 17, name: "Light Green", hex: "#86EFAC" },
	{ id: 18, name: "Beige", hex: "#F5F5DC" },
	{ id: 19, name: "Turquoise", hex: "#40E0D0" },
	{ id: 20, name: "Violet", hex: "#8B5CF6" },
	{ id: 21, name: "Dark Red", hex: "#B91C1C" },
	{ id: 22, name: "Golden", hex: "#FFD700" },
	{ id: 23, name: "Silver", hex: "#C0C0C0" },
];

const ColorPicker = ({ selectedColors, setSelectedColors }) => {
	const toggleColor = (color) => {
		if (selectedColors.some((c) => c.hex === color.hex)) {
			// Remove the color if already selected
			setSelectedColors(selectedColors.filter((c) => c.hex !== color.hex));
		} else {
			// Add the color to the selection
			setSelectedColors([...selectedColors, color]);
		}
	};

	return (
		<div className="max-w-md">
			<div className="grid grid-cols-8 gap-2 p-4 bg-gray-20 rounded-lg">
				{colors.map((color) => (
					<button
						key={color.hex}
						type="button"
						className={`relative w-6 h-6 rounded-full 
              transition-all duration-200 
              hover:scale-110 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${color.hex === "#FFFFFF" ? "border border-gray-200" : ""} 
              ${
								selectedColors.some((c) => c.hex === color.hex)
									? "ring-2 ring-offset-2 ring-blue-500 scale-110"
									: ""
							}`}
						style={{
							backgroundColor: color.hex,
						}}
						onClick={() => toggleColor(color)}
						title={color.name}
					>
						<span
							className="absolute text-xs font-semibold"
							style={{
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								color: color.hex === "#FFFFFF" ? "#000000" : "#FFFFFF", // Change text color to black if the color is white
							}}
						>
							{color.id}
						</span>
					</button>
				))}
			</div>

			{selectedColors.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-2">
					{selectedColors.map((color) => (
						<div
							key={color.hex}
							className="flex items-center gap-2 bg-gray-700 p-2 rounded"
						>
							<div
								className="w-4 h-4 rounded-full"
								style={{ backgroundColor: color.hex }}
							/>
							<span className="text-sm text-white">{`${color.name}`}</span>
							<button
								type="button"
								onClick={() => toggleColor(color)}
								className="text-red-500 hover:text-red-700"
							>
								×
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ColorPicker;
