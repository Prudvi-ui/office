import React, { useState } from 'react';
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

export default function Domaindetails({ navigation }) {
    const categories = [
        { id: 1, name: 'Domain', icon: 'web', nav: 'Domaindetails' },
        { id: 2, name: 'Hosting', icon: 'server', nav: 'Hostingdetails' },
        { id: 3, name: 'SSL', icon: 'lock', nav: 'Ssldetails' },
    ];

    const [activeCard, setActiveCard] = useState(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#001F54" barStyle="light-content" />

            {/* ✅ Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Icon name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Domain Related</Text>
                {/* Empty view to balance layout */}
                <View style={{ width: 26 }} />
            </View>

            {/* ✅ Category Grid */}
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.grid}>
                    {categories.map((item) => {
                        const isActive = activeCard === item.id;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    isActive && {
                                        backgroundColor: '#0c1247',
                                        borderColor: '#0c1247',
                                    },
                                ]}
                                onPress={() => {
                                    setActiveCard(item.id);
                                    navigation.navigate(item.nav);
                                }}
                                activeOpacity={0.8}
                            >
                                <Icon
                                    name={item.icon}
                                    size={30}
                                    color={isActive ? 'white' : '#E77D41'}
                                />
                                <Text
                                    style={[
                                        styles.cardText,
                                        isActive && { color: 'white' },
                                    ]}
                                >
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
        height: 70,
        backgroundColor: '#001F54',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 20
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
        color: '#001F54',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 14,
    },
});
