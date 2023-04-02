export const imageToBase64Async = async (image: string) => {
	const data = await fetch(image);
	const blob = await data.blob();

	return new Promise<string>((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			const base64data = reader.result as string;
			resolve(base64data);
		};
	});
};
