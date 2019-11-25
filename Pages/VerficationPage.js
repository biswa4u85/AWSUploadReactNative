import { Text, View, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input,Button } from 'react-native-elements';
import Amplify,{Auth} from 'aws-amplify';
import awsConfig from '../src/aws-exports';
Amplify.configure(awsConfig);
export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        debugger;
        this.userName = this.props.navigation.state.params.username;

        this.state = {
            usercode:''
        }
    }

    Verify = () =>{
        Auth.confirmSignUp(this.userName,this.state.usercode)
        .then(res => {
            console.log('confirmed!',res);
            this.props.navigation.navigate('LoginPage');
        }).catch(res => {
            console.log('err',res);
        });

    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder='Insert Verification Code Here...'
                    onChangeText={usercode => this.setState({ usercode })}
                    value={this.state.usercode}
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
                <Button
                    title="Verify"
                    type="outline"
                    onPress={this.Verify}
                />
            </View>
        );

    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        
    },
});