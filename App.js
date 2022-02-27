import React, { Component } from 'react';
import {
	View,
	Image,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Button,
	FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuid from 'uuid';
import Environment from './src/config/environment';
import firebase from './src/config/firebase';

console.disableYellowBox = true;

async function uploadImageAsync(uri) {
	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function() {
			resolve(xhr.response);
		};
		xhr.onerror = function(e) {
			console.log(e);
			reject(new TypeError('Network request failed'));
		};
		xhr.responseType = 'blob';
		xhr.open('GET', uri, true);
		xhr.send(null);
	});

	const ref = firebase
		.storage()
		.ref()
		.child(uuid.v4());
	const snapshot = await ref.put(blob);

	blob.close();

	return await snapshot.ref.getDownloadURL();
}

export default class App extends Component {
	state = {
		image: null,
		uploading: false,
		googleResponse: null
	};

	async componentDidMount() {
		await Permissions.askAsync(Permissions.CAMERA_ROLL);
		await Permissions.askAsync(Permissions.CAMERA);
	}

	organize = array => {
		return array.map(function(item, i) {
			return (
				<View key={i}>
					<Text>{item}</Text>
				</View>
			);
		});
	};

	_maybeRenderUploadingOverlay = () => {
		if (this.state.uploading) {
			return (
				<View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: 'rgba(255,255,255,0.4)',
							alignItems: 'center',
							justifyContent: 'center'
						}
					]}
				>
					<ActivityIndicator color="#fff" animating size="large" />
				</View>
			);
		}
	};

	_maybeRenderImage = () => {
		let { image, googleResponse } = this.state;
		if (!image) {
			return;
		}
	
		return (
			<View
				style={{
					marginTop: 20,
					width: 250,
					borderRadius: 3,
					elevation: 2
				}}
			>
				<Button
					style={{ marginBottom: 10 }}
					onPress={() => this.submitToGoogle()}
					title="Analyze!"
				/>

				<View
					style={{
						borderTopRightRadius: 3,
						borderTopLeftRadius: 3,
						shadowColor: 'rgba(0,0,0,1)',
						shadowOpacity: 0.2,
						shadowOffset: { width: 4, height: 4 },
						shadowRadius: 5,
						overflow: 'hidden'
					}}
				>
					<Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
				</View>
				<Text
					style={{ paddingVertical: 10, paddingHorizontal: 10 }}
				/>

				<Text>Raw JSON:</Text>

				{googleResponse && (
					<Text
						style={{ paddingVertical: 10, paddingHorizontal: 10 }}
					>
						{JSON.stringify(googleResponse.responses)}
					</Text>
				)}
			</View>
		);
	};

	_keyExtractor = (item, index) => item;

	_renderItem = item => {
		<Text>response: {JSON.stringify(item)}</Text>;
	};

	_takePhoto = async () => {
		let pickerResult = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3]
		});

		this._handleImagePicked(pickerResult);
	};

	_pickImage = async () => {
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3]
		});

		this._handleImagePicked(pickerResult);
	};

	_handleImagePicked = async pickerResult => {
		try {
			this.setState({ uploading: true });

			if (!pickerResult.cancelled) {
				uploadUrl = await uploadImageAsync(pickerResult.uri);
				this.setState({ image: uploadUrl });
			}
		} catch (e) {
			console.log(e);
			alert('Upload failed, sorry :(');
		} finally {
			this.setState({ uploading: false });
		}
	};

	submitToGoogle = async () => {
		try {
		  this.setState({ uploading: true });
		  let { image } = this.state;
		  let body = JSON.stringify({
			requests: [
			  {
				features: [
				  { type: "TEXT_DETECTION", maxResults: 10 },
				],
				image: {
				  source: {
					imageUri: image
				  }
				}
			  }
			]
		  });
		  let response = await fetch(
			"https://vision.googleapis.com/v1/images:annotate?key=" +
			  Environment["GOOGLE_CLOUD_VISION_API_KEY"],
			{
			  headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			  },
			  method: "POST",
			  body: body
			}
		  );
		  let responseJson = await response.json();
		  console.log(responseJson);
		  this.setState({
			googleResponse: responseJson,
			uploading: false
		  });
		} catch (error) {
		  console.log(error);
		}
	  };
	
	render() {
		let { image } = this.state;

		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.contentContainer}>
					<View style={styles.getStartedContainer}>
						{image ? null : (
							<Text style={styles.getStartedText}>Smart Text Extractor</Text>
						)}
					</View>

					<View style={styles.helpContainer}>
						<View style={{ margin: 20 }}>
							<Button
								onPress={this._pickImage}
								title="Pick an image from Gallery"
								color="#3b5998"
							/>
						</View>
						<Button
							onPress={this._takePhoto}
							title="Take a photo"
							color="#1985bc"
						/>

						{this.state.googleResponse && (
							<FlatList
								let data={this.state.googleResponse.responses[0].text}
								extraData={this.state}
								keyExtractor={this._keyExtractor}
								renderItem={({ item }) => (
									<Text style={styles.textText}>
										Text Detected: {item}
									</Text>
								)}
							/>
						)}

						{this._maybeRenderImage()}
						{this._maybeRenderUploadingOverlay()}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ebebeb',
		paddingBottom: 10
	},
	developmentModeText: {
		marginBottom: 20,
		color: 'rgba(0,0,0,0.4)',
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center'
	},
	contentContainer: {
		paddingTop: 30
	},

	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50,
		marginVertical: 50
	},

	getStartedText: {
		fontSize: 24,
		color: '#000',
		fontWeight: 'bold',
		textAlign: 'center'
	},

	helpContainer: {
		marginTop: 15,
		alignItems: 'center'
	},

	textText: {
		fontSize: 20,
		fontWeight: '600'
	}
});