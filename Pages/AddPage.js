import { View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { RNS3 } from 'react-native-s3-upload';
import { Container, Content, Form, Spinner, Button, Picker, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import { addData } from '../server/server';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export default class AddPage extends Component {

  audioRecorderPlayer = new AudioRecorderPlayer();

  constructor(props) {
    super(props);
    this.state = {
      isLoadingImg: false,
      isLoading: false,
      userInfo: null,
      userId: '',
      userName: '',
      mobile: '',
      types: ['images', 'video', 'audio'],
      type: 'images',
      filePath: null,
      fileError: null,
      tags: null,
      newTag: ''
    }
  }

  async componentDidMount() {
    let mobile = await AsyncStorage.getItem('userPhone');
    let userInfo = await AsyncStorage.getItem('userInfo');
    let userDetails = JSON.parse(userInfo)
    this.setState({ userId: userDetails.payload.client_id, userName: userDetails.payload.username, mobile })
  }

  AddNewPage = async () => {
    const { navigate } = this.props.navigation
    const { userId, userName, mobile, type, filePath, tags } = this.state
    let params = { userId, userName, mobile, type, filePath, tags }
    if (!params.tags) {
      alert('Add a Tag');
      return
    } else {
      params.tags = [params.tags]
    }
    if (!params.filePath) {
      alert('Add a File');
      return
    }
    this.setState({ isLoading: true })
    let result = await addData('files', params)
    if (result.statusCode == 200) {
      this.setState({ isLoading: false })
      navigate('ListPage', { refresh: true })
    } else {
      this.setState({ isLoading: false })
    }
  }

  _takePhoto = async () => {
    const { type, tags } = this.state
    if (!tags) {
      alert('Add a Tag');
      return
    }
    if (type == 'images') {
      this.imageUpload()
    } else if (type == 'video') {
      this.videoUpload()
    } else {
      this.audioUpload()
    }
  };

  _recordAudio = async () => {
    const result = await this.audioRecorderPlayer.startRecorder();
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
      return;
    });
    console.log(result);
  };

  imageUpload() {
    const options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        alert('Cancel By User');
      } else if (response.error) {
        alert('Error...');
      } else if (response.customButton) {
        alert('Error...');
      } else {
        response['name'] = response.fileName
        this.uploadFile(response)
      }
    });
  }

  videoUpload() {
    const options = {
      title: 'Select the perfect view',
      takePhotoButtonTitle: `Take a video ...`,
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'movies',
      },
      noData: true
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        alert('Cancel By User');
      } else if (response.error) {
        alert('Error...');
      } else if (response.customButton) {
        alert('Error...');
      } else {
        let fileType = (response.path).split('.')
        let fileName = (fileType[0]).split('/')
        response['name'] = `${fileName[fileName.length - 1]}.${fileType[1]}`
        response['type'] = `video/${fileType[1]}`
        this.uploadFile(response)
      }
    });
  }

  async audioUpload() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      const response = {
        uri: res.uri,
        name: res.name,
        type: res.type,
      }
      this.uploadFile(response)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        alert('Cancel By User');
      } else {
        throw err;
      }
    }
  }

  uploadFile(response) {
    const { type, tags } = this.state
    const options = {
      // ${type}/
      keyPrefix: `${tags}/`,
      bucket: `listfiles-files-new`,
      region: "us-east-1",
      accessKey: "AKIAZEGHFY3HS7XVCTOL",
      secretKey: "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",
      successActionStatus: 201
    }
    // console.log(response)
    // console.log(options)
    this.setState({ isLoadingImg: true });
    RNS3.put(response, options).then(files => {
      if (files.status !== 201) {
        this.setState({ isLoadingImg: false });
      } else {
        let data = files.body
        this.setState({ filePath: data.postResponse.location, isLoadingImg: false });
      }
      console.log("Failed to upload image to S3", files);
      this.setState({ isLoadingImg: false });
    });
  }

  randerImg() {
    const { fileError, filePath, isLoadingImg, type } = this.state;
    if (isLoadingImg) {
      return <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
        <Spinner color='#ff0000' />
      </View>
    } else {
      return <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
        {type == 'audio' ?
          <TouchableOpacity onPress={this._recordAudio}>
            <Text>RECORD AUDIO</Text>
          </TouchableOpacity> : null}
        <TouchableOpacity onPress={this._takePhoto}>
          <View>
            {fileError ? <Text style={{ color: '#ff0000', fontSize: 12 }}>{fileError}</Text> : null}
            {filePath ? <Thumbnail square large source={{ uri: filePath }} /> : <Icon name='file' size={100} color='black' />}
            <Text>UPLOAD</Text>
          </View>
        </TouchableOpacity>
      </View>
    }
  }

  render() {
    const { isLoading, types, type, tags, newTag } = this.state
    return (
      <Container>
        <Content style={{ margin: 10, flex: 1, marginVertical: 100 }}>
          <Form>
            <View style={{ margin: 10 }}>
              <Text>File Type</Text>
              <Picker
                mode="dropdown"
                iosHeader="Select File Type"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                selectedValue={type}
                onValueChange={(type) => this.setState({ type })}
              >
                {types.map((item, key) => <Picker.Item key={key} label={item} value={item} />)}
              </Picker>
            </View>
            <View>
              <View>
                <Input
                  placeholder='Insert tag'
                  value={tags}
                  inputStyle={{ marginLeft: 10, color: 'black' }}
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  placeholderTextColor="black"
                  onChangeText={(tags) => this.setState({ tags })}
                  leftIcon={
                    <Icon
                      name='user'
                      size={24}
                      color='black'
                    />
                  }
                />
              </View></View>
            {this.randerImg()}
            <Button style={{ marginTop: 20 }} block success onPress={this.AddNewPage}>
              <Text style={{ color: '#fff', fontSize: 20, marginRight: 10 }}>Save</Text>
              {isLoading ? <Spinner color='#fff' /> : null}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}