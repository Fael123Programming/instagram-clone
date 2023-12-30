import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import Styles from '../util/Styles';
import * as ImagePicker from 'expo-image-picker';

export default function Add({navigation}) {
  const [cameraPermissions, setCameraPermissions] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [aspectRatioOne, setAspectRatioOne] = useState(true);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
    })();
  }, []);

  if (!cameraPermissions) {
    return <View/>;
  }

  if (!cameraPermissions.granted) {
    return (
      <View style={Styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const flipCamera = () => {
    if (type === CameraType.back) {
      setType(CameraType.front);
    } else {
      setType(CameraType.back);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      setAspectRatioOne(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setAspectRatioOne(false);
    }
  };

  const save = () => {
    navigation.navigate('Save', {image});
  };

  return (
    <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => setCamera(ref)}
            style={[{flex: 1, flexDirection: 'row'}, aspectRatioOne ? {aspectRatio: 1} : {}]}
            type={type}
            ratio={'1:1'}
          />
        </View>
        <Button
          title={'Flip Camera'}
          onPress={flipCamera}
        />
        <Button
          title={'Take Picture'}
          onPress={takePicture}
        />
        <Button
          title={'Pick an Image from the Gallery'}
          onPress={pickImage}
        />
        <Button
          title={'Save'}
          onPress={save}
        />
        {
          image &&
          <Image source={{uri: image}} style={{flex: 1}}/>
        }
    </View>
  )
}
