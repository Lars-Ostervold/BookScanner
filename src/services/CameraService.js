import { RNCamera } from 'react-native-camera';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';


const CameraService = {
  takePicture: async (cameraRef) => {
    if (cameraRef && cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        return data.uri; // Return the URI of the captured image
      } catch (error) {
        console.error("Error taking picture: ", error);
        return null;
      }
    } else {
      console.error("Camera reference not available");
      return null;
    }
  },

  checkCameraPermissions: async () => {
    try {
      const result = await check(PERMISSIONS.IOS.CAMERA);
      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        const permissionRequest = await request(PERMISSIONS.IOS.CAMERA);
        return permissionRequest === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error("Error checking camera permissions: ", error);
      return false;
    }
  },

  // Other camera-related functions can be added here
};

export default CameraService;
