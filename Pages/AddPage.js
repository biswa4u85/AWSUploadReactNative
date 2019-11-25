import { View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { Container, Content, Form, Spinner, Button, Picker, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { addData, addFile } from '../server/server';

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
      types: ['image', 'video', 'sound'],
      type: 'image',
      filePath: null,
      fileError: null,
      tags: [],
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
    this.setState({ isLoading: true })
    let params = { userId, userName, mobile, type, filePath, tags }
    let result = await addData('files', params)
    if (result.statusCode == 200) {
      this.setState({ isLoading: false })
      navigate('ListPage', { refresh: true })
    } else {
      this.setState({ isLoading: false })
    }
  }

  _takePhoto = async () => {
    const { type } = this.state
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
        let imageType = (response.type).split('/')
        if (type != imageType[0]) {
          this.setState({ fileError: `Its not a currect File` })
          return
        } else {
          this.setState({ fileError: null })
        }
        this.setState({ isLoadingImg: true });
        addFile(response).then((imgUrl) => {
          if (imgUrl) {
            this.setState({ filePath: imgUrl.callback_url, isLoadingImg: false });
          }
          this.setState({ isLoadingImg: false });
        })
      }
    });
  };

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

  updateServiceTypes(val, type) {
    const { tags } = this.state;
    let tempTags = []
    let value = val.toLowerCase()
    if (type === 'add' && tags.indexOf(value) === -1) {
      tags.push(value)
      tempTags = tags
    } else if (type === 'remove') {
      for (let item of tags) {
        if (item != val) {
          tempTags.push(item)
        }
      }
    }
    this.setState({ tags: tempTags, newTag: '' })
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
            {this.randerImg()}
            <View><View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 10 }}>
              {tags.map((item, key) => <View key={key} style={{ backgroundColor: '#ff0000', flexDirection: 'row', margin: 5, padding: 5 }}><Text style={{ fontSize: 16, color: '#000' }}>{item}</Text><TouchableOpacity onPress={() => this.updateServiceTypes(item, 'remove')}><Icon style={{ fontSize: 16, color: '#fff' }} type={'AntDesign'} name={'close'} /></TouchableOpacity></View>)}
            </View>
              <View>
                <Input
                  placeholder='Insert tag'
                  value={newTag}
                  inputStyle={{ marginLeft: 10, color: 'black' }}
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  placeholderTextColor="black"
                  onChangeText={(newTag) => this.setState({ newTag })}
                  onSubmitEditing={() => this.updateServiceTypes(newTag, 'add')}
                  leftIcon={
                    <Icon
                      name='user'
                      size={24}
                      color='black'
                    />
                  }
                />
              </View></View>
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