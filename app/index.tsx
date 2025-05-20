import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface Breed {
	id: string;
	name: string;
}

interface DogImage {
	url: string;
}

export default function Index() {
	const [selectedBreed, setSelectedBreed] = useState<string>("");
	const [breeds, setBreeds] = useState<Breed[]>([]);
	const [image, setImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchBreeds = async () => {
			try {
				const response = await fetch(
					"https://api.thedogapi.com/v1/breeds",
					{
						headers: {
							"x-api-key":
								"live_Kt2JF6QmcvdzHFPQDOU2nll2dul6fPeQPIVcrBeytn2lctFTERkUkxsq3oLX6FIw",
						},
					}
				);
				const data: Breed[] = await response.json();
				setBreeds(data);
				if (data.length > 0) {
					setSelectedBreed(data[0].id);
				}
			} catch (error) {
				console.error("Error fetching breeds:", error);
			}
		};
		fetchBreeds();
	}, []);

	const fetchImage = async () => {
		setIsLoading(true);
		try {
			const url = selectedBreed
				? `https://api.thedogapi.com/v1/images/search?limit=1&breed_ids=${selectedBreed}`
				: "https://api.thedogapi.com/v1/images/search?limit=1";
			const response = await fetch(url, {
				headers: {
					"x-api-key":
						"live_Kt2JF6QmcvdzHFPQDOU2nll2dul6fPeQPIVcrBeytn2lctFTERkUkxsq3oLX6FIw",
				},
			});
			const data: DogImage[] = await response.json();
			setImage(data[0]?.url || null);
			console.log("Fetched image:", data[0]?.url);
		} catch (error) {
			console.error("Error fetching image:", error);
			setImage(null);
		} finally {
			setIsLoading(false); // Stop loading
		}
	};

	useEffect(() => {
		if (selectedBreed) {
			fetchImage();
		}
	}, [selectedBreed]);

	return (
		<SafeAreaView className="flex-1 bg-green-100">
			<View className="p-4 bg-green-400">
				<Text className="text-3xl font-bold text-white text-center">
					Galerie de chiens 🐶
				</Text>
			</View>

			<View className="mx-4 my-4">
				<View className="bg-white rounded-full shadow-md border border-gray-300">
					<Picker
						selectedValue={selectedBreed}
						onValueChange={(itemValue: string) =>
							setSelectedBreed(itemValue)
						}
						style={{
							paddingHorizontal: 16,
							paddingVertical: 10,
							fontSize: 18,
						}}
					>
						<Picker.Item
							label="Sélectionner une race..."
							value=""
						/>
						{breeds.map((breed) => (
							<Picker.Item
								key={breed.id}
								label={breed.name}
								value={breed.id}
							/>
						))}
					</Picker>
				</View>
			</View>

			<View className="flex-1 px-4 justify-center items-center">
				{isLoading ? (
					<View className="w-full h-96 justify-center items-center rounded-lg overflow-hidden shadow-md mb-4 bg-gray-100">
						<ActivityIndicator size="large" color="#05e626" />
					</View>
				) : image ? (
					<View className="w-full h-96 justify-center items-center rounded-lg overflow-hidden shadow-md mb-4 bg-gray-100">
						<Image
							source={{ uri: image }}
							className="w-full h-full"
							resizeMode="contain"
						/>
					</View>
				) : (
					<Text className="text-center text-gray-500 mt-4">
						Pas d&apos;image disponible
					</Text>
				)}
				<TouchableOpacity
					onPress={fetchImage}
					className="bg-green-400 rounded-full py-3 px-6 mt-4"
				>
					<Text className="text-white text-lg font-semibold">
						Suivant
					</Text>
				</TouchableOpacity>
			</View>
			<View className="bg-green-400 p-4">
				<Text className="text-center text-white">
					© by Andriantsoa 2025
				</Text>
			</View>
		</SafeAreaView>
	);
}
