# Smart Text Extractor (Since 2019)

The primary function of the Smart Text Extractor is to extract text from an image taken by a smartphone's camera or retrieved from its gallery.

![image](https://user-images.githubusercontent.com/81354022/155883522-2ef43a93-61e4-4760-8a69-182b4ea09e70.png)

## Architecture

![image](https://user-images.githubusercontent.com/81354022/155883768-8a0c4b13-ff2f-4f14-82fd-a88553415188.png)

## Preparation

1) Generate the skeleton of this project using **Crowdbotics**.
2) Confirm the list of dependencies in **package.json** and install them using the command: `npm install`
4) Create the **Firebase** and **Google Vision** accounts needed for this project. Install Firebase modules: `npm install --save firebase`
5) **Find API keys on Firebase and Google Visions dashboards** and place them in an **environment.js or .env file** (Remember to mention these files in .gitignore!)
6) Keys are invoked by the main JavaScript file **App.js** via a **firebase.js** file, which must be in the same folder as the environment.js file 
7) Note that after loading the app via the **Expo CLI**, you will be asked to grant the app permission to access your smartphone's gallery and camera

## App.js

An explanation of the functions in App.js:
1) **uploadImageAsync** - Store images captured by the smartphone's camera in Firebase

![image](https://user-images.githubusercontent.com/81354022/155883671-1fd16d3e-70fa-4e40-8c19-cc3c9f896e12.png)

2)  **_takePhoto** - responsible for the app's ability to take photos
3)  **_pickImage** - responsible for the app's ability to retrieve gallery images
4)  **submitToGoogle** - submits image to the Text Detection API from Google Vision

## Use Case 1

This is an image retrieved from my gallery:

 ![image](https://user-images.githubusercontent.com/81354022/155883880-715202a0-ccfe-4c6a-b2f1-ce870d8a3f12.png)

The image is now picked and uploaded to the app for text extraction:

 ![image](https://user-images.githubusercontent.com/81354022/155883887-98981d94-da29-4e40-a5ef-c483d1945196.png)

The output will be as below:

![image](https://user-images.githubusercontent.com/81354022/155883894-8fe19089-4b4d-4083-8f22-64fe130be81a.png) 

## Use case 2
This is an image of a document taken by my smartphone’s camera. It can be cropped to produce:

![image](https://user-images.githubusercontent.com/81354022/155883907-24f526c8-6d29-4d1c-801f-3f59465f6aba.png)

The user can now upload the cropped image to the app for extraction:

![image](https://user-images.githubusercontent.com/81354022/155883934-c2cbd2ec-1c03-4749-8164-416ed3af4560.png)

## Use case 3
If an image does not contain any text, there will be no output available:

![image](https://user-images.githubusercontent.com/81354022/155883940-5b16db48-e19d-4d41-8795-68776ed90f53.png)

## References

In the course of building this app, I referred to the project below, which focused on labelling logos in images. 

https://github.com/crowdbotics-apps/rngooglevisionapi-1400/tree/master/frontend
