# BookScanner
I never ended up deploying this to the App Store since there are other free options available. Just wanted to build an App 🙂. If somebody wants to chuck it on the app store, be my guest.

## Demo Video
https://github.com/Lars-Ostervold/BookScanner/assets/122698832/763918f7-7806-4605-9a7c-3c48a72f647f

## Overview

This app is designed to help you manage your book library. With the ability to scan, catalog, and organize your books.

## Features
- **Book Scanning**: Use your device's camera to scan the ISBN of a book and retrieve its information.
- **Add by ISBN**: Manually enter an ISBN and search.
- **Personal Library**: Add scanned books to your personal library catalog.
- **Organizing**: Sort and filter your library to find books quickly and easily.

## Technologies Used
- **Frontend**: React Native
- **Scanning**: Expo's BarcodeScanner API
- **Database Backend**: Firestore
- **Book Database**: Google Books

## Installation

### iOS Install
The app can be downloaded from the Apple App Store here - NOT PUBLISHED.

### Prerequisites
- Node.js
- Expo CLI

### Development Installation Steps
1. Clone the repository.
2. Install Node.js dependencies with `npm install`.
3. Set up your own Firebase project, then put your config info in a file named '.env' in the project root directory. Name the variables according to the import statement in FirebaseConfig.js
4. Start the Expo server with `npx expo start --tunnel`.
5. Scan the QR code with your mobile device to start the app.

## Usage

### Scan Books
1. From the main screen, tap the 'Scan' button.
2. Point your device's camera at the ISBN of a book.
3. The app will automatically retrieve and store the book's information.

### Organize Shelf
1. From the main screen, tap the 'My Library' button.
2. Use the 'Sort' and 'Filter' options to organize your library.

## Development

### Folder Structure
- `src/screens/`: Contains the different screens of the app.
- `src/services/`: Contains Firebase authentication and camera auth.


## License
This project is licensed under the Apache License 2.0. See the `LICENSE` file for details.
