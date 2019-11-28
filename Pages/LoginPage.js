import { Text, StyleSheet, AsyncStorage } from 'react-native';
import React, { Component } from 'react';
import { Container, Content, Form, Spinner, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import SplashScreen from 'react-native-smart-splash-screen'
import { Auth } from 'aws-amplify';

export default class LoginPage extends Component {

    static navigationOptions = () => ({
        header: null
    })

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userPhone: '+919439700504',
            password: 'Biswa123!'
        }
    }

    async componentDidMount() {
        SplashScreen.close({ animationType: SplashScreen.animationType.scale, duration: 2000, delay: 300 })
        this.getCurUserInfo()
    }

    async getCurUserInfo() {
        const { navigate } = this.props.navigation
        this.setState({ isLoading: true })
        Auth.currentSession().then(async (res) => {
            let accessToken = res.getAccessToken()
            let jwt = accessToken.getJwtToken()
            let userInfo = accessToken
            userInfo['jwt'] = jwt
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            this.setState({ isLoading: false })
            navigate('ListPage')

        }).catch(async (error) => {
            console.log(error)
            await AsyncStorage.setItem('userInfo', JSON.stringify(null));
            this.setState({ isLoading: false })
        });
    }

    Login = async () => {
        const { userPhone, password } = this.state
        this.setState({ isLoading: true })
        Auth.signIn(userPhone, password)
            .then(async (res) => {
                this.getCurUserInfo()
                await AsyncStorage.setItem('userPhone', userPhone);
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false })
            })
    }


    render() {
        const { isLoading } = this.state
        const { navigate } = this.props.navigation
        return (
            <Container>
                <Content style={{ margin: 10, flex: 1, marginVertical: 100 }}>
                    <Form>
                        <Input
                            placeholder='Insert Phone Here...'
                            onChangeText={userPhone => this.setState({ userPhone })}
                            value={this.state.userPhone}
                            inputStyle={{ marginLeft: 10, color: 'black' }}
                            keyboardAppearance="light"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="done"
                            placeholderTextColor="black"
                            leftIcon={
                                <Icon
                                    name='user'
                                    size={24}
                                    color='black'
                                />
                            }
                        />
                        <Input
                            placeholder='Insert Password here...'
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                            inputStyle={{ marginLeft: 10, color: 'black' }}
                            secureTextEntry={true}
                            keyboardAppearance="light"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="done"
                            ref={input => (this.passwordInput = input)}
                            blurOnSubmit={true}
                            placeholderTextColor="black"
                            leftIcon={
                                <Icon
                                    name='lock'
                                    size={24}
                                    color='black'
                                />
                            }
                        />
                        <Button style={{ marginTop: 20 }} block success onPress={this.Login}>
                            <Text style={{ color: '#fff', fontSize: 20, marginRight: 10 }}>Login</Text>
                            {isLoading ? <Spinner color='#fff' /> : null}
                        </Button>
                        <Text style={{ color: '#000', fontSize: 20, marginTop: 10 }}>Not user? sign up here...</Text>
                        <Button style={{ marginTop: 20 }} block info onPress={() => navigate('SignupPage')}>
                            <Text style={{ color: '#fff', fontSize: 20 }}>Sign Up</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );

    }
}