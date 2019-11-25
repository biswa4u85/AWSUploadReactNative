import { Text, View, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input,Button } from 'react-native-elements';
import Amplify,{Auth} from 'aws-amplify';
import awsConfig from '../src/aws-exports';


Amplify.configure(awsConfig);

class SignupPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userPhone: '',
            password: '',
            userEmail:'',
            userName:''
        }
    }

    SignUpUseConito = () =>{
        console.log(JSON.stringify(this.state));
        Auth.signUp({
            username:this.state.userName,
            password: this.state.password,
            attributes:{
            phone_number:this.state.userPhone,
            email:this.state.userEmail
            }
        })
        .then(res => {
            console.log('signup! ',res);
            this.props.navigation.navigate('VerficationPage',{username:this.state.userName});
        }).catch(res=>{
            console.log('err',res);
        })
        console.log("signupPage: "+ this.state.userName);
        

    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder='Insert Full Name Here...'
                    onChangeText={userName => this.setState({ userName })}
                    value={this.state.userName}
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
                    placeholder='Insert Email Here...'
                    onChangeText={userEmail => this.setState({ userEmail })}
                    value={this.state.userEmail}
                    inputStyle={{ marginLeft: 10, color: 'black' }}
                    keyboardAppearance="light"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="done"
                    placeholderTextColor="black"
                    leftIcon={
                        <Icon
                            name='email'
                            size={24}
                            color='black'
                        />
                    }
                />
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
                            name='phone'
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
                <Button
                    title="SignUp"
                    type="outline"
                    onPress={this.SignUpUseConito}
                />

            </View>
        );

    }
}


export default SignupPage;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        
    },
});