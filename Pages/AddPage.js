import { View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { RNS3 } from 'react-native-s3-upload';
import { Container, Content, Form, Spinner, Button, Picker, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import { addData } from '../server/server';
const FilePickerManager = require('NativeModules').FilePickerManager;

export default class AddPage extends Component {

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
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types[type]],
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
    // const options = {
    //   title: 'Select the perfect view',
    //   takePhotoButtonTitle: `Take a ${type} ...`,
    //   mediaType: type,
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images'
    //   },
    //   noData: true
    // };
    // ImagePicker.showImagePicker(options, response => {
    //   if (response.didCancel) {
    //     alert('Cancel By User');
    //   } else if (response.error) {
    //     alert('Error...');
    //   } else if (response.customButton) {
    //     alert('Error...');
    //   } else {
    //     this.setState({ isLoadingImg: true });
    //     let fileType = (response.path).split('.')
    //     let fileName = (fileType[0]).split('/')
    //     response['name'] = `${fileName[fileName.length - 1]}.${fileType[1]}`
    //     response['type'] = `${type == 'photo' ? 'image' : type}/${fileType[1]}`
    //     const options = {
    //       keyPrefix: `${tags}/`,
    //       bucket: "listfiles-files-new",
    //       region: "us-east-1",
    //       accessKey: "AKIAZEGHFY3HS7XVCTOL",
    //       secretKey: "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",
    //       successActionStatus: 201
    //     }
    //     console.log(options)
    //     console.log(response)
    //     RNS3.put(response, options).then(files => {
    //       if (files.status !== 201) {
    //         this.setState({ isLoadingImg: false });
    //       } else {
    //         let data = files.body
    //         this.setState({ filePath: data.postResponse.location, isLoadingImg: false });
    //       }
    //       console.log("Failed to upload image to S3", files);
    //       this.setState({ isLoadingImg: false });
    //     });
    //   }
    // });
  };

  imageUpload() {
    const options = {
      title: 'Select the perfect view',
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
        let fileType = (response.path).split('.')
        let fileName = (fileType[0]).split('/')
        response['name'] = `${fileName[fileName.length - 1]}.${fileType[1]}`
        response['type'] = `image/${fileType[1]}`
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

  audioUpload() {
    FilePickerManager.showFilePicker(null, (response) => {
      if (response.didCancel) {
        alert('Cancel By User');
      } else if (response.error) {
        alert('Error...');
      } else {
        this.uploadFile(response)
      }
    });
  }

  uploadFile(response) {
    const { type, tags } = this.state
    const options = {
      keyPrefix: `${tags}/${type}/`,
      bucket: "listfiles-files-new",
      region: "us-east-1",
      accessKey: "AKIAZEGHFY3HS7XVCTOL",
      secretKey: "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",
      successActionStatus: 201
    }
    console.log(response)
    console.log(options)
    // this.setState({ isLoadingImg: true });
    // RNS3.put(response, options).then(files => {
    //   if (files.status !== 201) {
    //     this.setState({ isLoadingImg: false });
    //   } else {
    //     let data = files.body
    //     this.setState({ filePath: data.postResponse.location, isLoadingImg: false });
    //   }
    //   console.log("Failed to upload image to S3", files);
    //   this.setState({ isLoadingImg: false });
    // });
  }

  randerImg() {
    const { fileError, filePath, isLoadingImg } = this.state;
    if (isLoadingImg) {
      return <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
        <Spinner color='#ff0000' />
      </View>
    } else {
      return <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={this._takePhoto}>
          <View>
            {fileError ? <Text style={{ color: '#ff0000', fontSize: 12 }}>{fileError}</Text> : null}
            {filePath ? <Thumbnail square large source={{ uri: filePath }} /> : <Icon name='file' size={100} color='black' />}
            <Text>Upload</Text>
          </View>
        </TouchableOpacity>
      </View>
    }
  }

  // updateServiceTypes(val, type) {
  //   const { tags } = this.state;
  //   let tempTags = []
  //   let value = val.toLowerCase()
  //   if (type === 'add' && tags.indexOf(value) === -1) {
  //     tags.push(value)
  //     tempTags = tags
  //   } else if (type === 'remove') {
  //     for (let item of tags) {
  //       if (item != val) {
  //         tempTags.push(item)
  //       }
  //     }
  //   }
  //   this.setState({ tags: tempTags, newTag: '' })
  // }

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
              {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 10 }}>
              {tags.map((item, key) => <View key={key} style={{ backgroundColor: '#ff0000', flexDirection: 'row', margin: 5, padding: 5 }}><Text style={{ fontSize: 16, color: '#000' }}>{item}</Text><TouchableOpacity onPress={() => this.updateServiceTypes(item, 'remove')}><Icon style={{ fontSize: 16, color: '#fff' }} type={'AntDesign'} name={'close'} /></TouchableOpacity></View>)}
            </View> */}
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
                  // onSubmitEditing={() => this.updateServiceTypes(newTag, 'add')}
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