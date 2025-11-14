import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function Wordpress({ navigation }) {
    const [activeId, setActiveId] = useState(null);

    const categories = [
        { id: 1, name: 'Monthly Payments', icon: 'cash-multiple', nav: 'Monthlypayments' },
        { id: 2, name: 'Google My Businesses', icon: 'google-my-business', nav: 'Googlemybusinesses' },
        { id: 3, name: 'What’s up Bulk SMS', icon: 'message-bulleted', nav: 'Whatsupbulksms' },
        { id: 4, name: 'OnPage/OffPage SEO', icon: 'magnify-scan', nav: 'OnPageoffPage' },
        { id: 5, name: 'Google Ads', icon: 'google-ads', nav: 'Googleads' },
        { id: 6, name: 'Meta Ads', icon: 'facebook', nav: 'Metaads' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>WordPress</Text>
                <Text style={styles.headerTitle}></Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.grid}>
                    {categories.map((item) => {
                        const isActive = activeId === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: isActive ? '#0c1247' : '#fff',
                                        borderColor: isActive ? '#0c1247' : '#001F54',
                                    },
                                ]}
                                onPress={() => {
                                    setActiveId(item.id);
                                    navigation.navigate(item.nav);
                                }}
                                activeOpacity={0.8}>
                                <Icon
                                    name={item.icon}
                                    size={30}
                                    color={isActive ? '#fff' : '#E77D41'}
                                />
                                <Text
                                    style={[
                                        styles.cardText,
                                        { color: isActive ? '#fff' : '#001F54' },
                                    ]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#001F54',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
    },
    container: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    grid: {
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 25,
        marginVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',

        // Thin border around card
        borderWidth: 1,
        borderColor: 'rgba(0, 20, 70, 0.25)',

        // Thick left border
        // LEFT border
        borderLeftWidth: 2,
        borderLeftColor: '#001F54',

        // RIGHT border
        borderRightWidth: 8,
        borderRightColor: '#001F54',

        // BOTTOM border (if you want)
        borderBottomWidth: 6,
        borderBottomColor: '#082049ff',
        borderTopWidth: 2,
        borderTopColor: '#082049ff',
        // Shadow
        shadowColor: '#160534ff',
        shadowOffset: { width: 8, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 20,
    },

    cardText: {
        marginTop: 10,
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 14,
    },
});
