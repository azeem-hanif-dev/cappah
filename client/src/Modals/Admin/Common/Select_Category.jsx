import React, { useState, useEffect } from "react";
import { fetchCategories } from "../../../Api/GetCategories.Api";

const Select_Category = ({
	label,
	name,
	register,
	error,
	defaultValue = "",
	required = false,
	onChange,
}) => {
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [fetchError, setFetchError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setFetchError(null);
			try {
				const categories = await fetchCategories();
				setOptions(categories);
			} catch (error) {
				setFetchError("Failed to load options.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div>
			{label && <label className="block mb-2 font-medium">{label}</label>}
			{loading ? (
				<p className="text-black text-sm">Loading options...</p>
			) : fetchError ? (
				<p className="text-red-500 text-sm">{fetchError}</p>
			) : (
				<select
					{...(register ? register(name, { required }) : {})}
					name={name}
					defaultValue={defaultValue}
					onChange={onChange}
					className="w-full p-3 text-black rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="" disabled>
						Select a category
					</option>
					{options.map((option) => (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					))}
				</select>
			)}
			{error && (
				<span className="text-red-500 text-sm mt-1">
					{error.message || "This field is required"}
				</span>
			)}
		</div>
	);
};

export default Select_Category;
