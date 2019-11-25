import { AsyncStorage, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Title, H1 } from 'native-base';
import { getData, deleteData } from '../server/server';

export default class ListPage extends Component {

  static navigationOptions = () => ({
    header: null
  })

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      fileList: [],
      userInfo: null
    }
  }

  async componentDidMount() {
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({ userInfo: JSON.parse(userInfo) })
    this.getData()
  }

  _onRefresh = () => {
    this.getData()
  }

  async getData() {
    let data = await getData('files')
    if (data.statusCode == 200) {
      this.setState({ fileList: data.body })
    }
  }

  async detaleData(item) {
    let data = await deleteData(`files/${item.id}`)
    if (data.statusCode == 200) {
      this.getData()
    }
  }

  render() {
    const { navigate } = this.props.navigation
    const { fileList, userInfo, refreshing } = this.state
    let username = (userInfo && userInfo.payload) ? userInfo.payload.username : null
    // console.log('list... ', fileList)
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>{username}</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => navigate('AddPage')}>
              <Text style={{ color: '#ff0000' }}>ADD</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <Content>
          <ScrollView showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
            {fileList && fileList.length > 0 ? <List>
              {fileList.map((item, key) => <ListItem key={key} thumbnail>
                <Left>
                  <Thumbnail square source={{ uri: item.filePath }} />
                </Left>
                <Body>
                  <Text>{item.userName}, {item.mobile}</Text>
                  <Text>{item.type}</Text>
                  <Text note numberOfLines={1}>{item.tags ? (item.tags).join() : ''}</Text>
                </Body>
                <Right>
                  <Button transparent onPress={() => this.detaleData(item)}>
                    <Text>DELETE</Text>
                  </Button>
                </Right>
              </ListItem>)}
            </List> : <H1 style={{ color: '#ff0000', padding: 10, textAlign:'center' }}>No Date</H1>}
          </ScrollView>
        </Content>
      </Container>
    )
  }
}