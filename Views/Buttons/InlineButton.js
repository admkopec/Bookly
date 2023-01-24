import {Platform, PlatformColor, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const InlineButton = ({
                          title,
                          color = Platform.OS === 'ios' ? PlatformColor('systemFill') : '#a0a0a0',
                          width,
                          icon,
                          onPress,
                      }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const fontStyle = {
        fontSize: 15,
        textAlign: 'center',
        color: isDarkMode ? Colors.white : Colors.black,
    };

    const buttonStyle = {
        width: width ?? 'auto',
        backgroundColor: color,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        margin: 'auto',
    };

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            {icon ? (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Icon name={icon} size={16} color={'#fff'} />
                    <Text style={fontStyle}>&nbsp;{title}</Text>
                </View>
            ) : (
                <Text style={fontStyle}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default InlineButton;
