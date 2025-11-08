import React, { useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function Domaindetails({ navigation }) {
    const categories = [
        { id: 1, name: 'Domain', icon: 'web', nav: 'Domaindetails' },
        { id: 2, name: 'Hosting', icon: 'server', nav: 'Hostingdetails' },
        { id: 3, name: 'SSL', icon: 'lock', nav: 'Ssldetails' },
    ];




    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#001F54" barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Domain Related</Text>
                <Text style={styles.headerTitle}></Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.grid}>
                    {categories.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            onPress={() => navigation.navigate(item.nav)}
                            activeOpacity={0.8}>
                            <Icon name={item.icon} size={30} color="#001F54" />
                            <Text style={styles.cardText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#001F54',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#001F54',
        marginTop:20
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
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#001F54',
        borderRadius: 10,
        paddingVertical: 25,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#001F54',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    cardText: {
        marginTop: 10,
        color: '#001F54',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 14,
    },
});
