import { Loader } from "lucide-react";
import { useState } from "react";
import { ImageIcon, Trash2Icon } from "lucide-react";
const ProductImage = ({ src, onRemove, path }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	return (
		<div className="relative w-full h-24">
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-bggray rounded-lg">
					<Loader className="w-6 h-6 animate-spin text-primary" />
				</div>
			)}

			<img
				src={`${src}`}
				alt="Product"
				className={`w-full h-full object-contain bg-white rounded-lg transition-opacity duration-200 ${
					isLoading ? "opacity-0" : "opacity-100"
				}`}
				onLoad={() => setIsLoading(false)}
				onError={() => {
					setIsLoading(false);
					setHasError(true);
				}}
			/>
			<button
				onClick={() => onRemove(path)}
				className="absolute top-2 right-2  text-admintext bg-bggray rounded-full w-8 h-8 flex items-center justify-center hover:bg-error hover:text-white transition-colors"
			>
				<Trash2Icon className="w-4 h-4 text-white" />
			</button>
		</div>
	);
};

export default ProductImage;
