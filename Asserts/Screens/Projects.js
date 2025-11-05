import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Dashboard({ navigation }) {
    // Shift Info Data
    const shiftData = [
        { id: '1', icon: 'clock-outline', color: '#007AFF', time: '08:45 AM', label: 'Start Shift' },
        { id: '2', icon: 'clock-end', color: '#FF9500', time: '05:45 PM', label: 'End Shift' },
    ];

    // Attendance Summary Data
    const attendanceData = [
        { id: '1', icon: 'calendar-clock', color: '#007AFF', time: '54%', label: 'Time OFF' },
        { id: '2', icon: 'calendar-check', color: '#34C759', time: '12 Days', label: 'Total Attended' },
    ];

    // Today Task Data
    const taskData = [
        {
            id: '1',
            title: 'Customer Service',
            date: 'March 25 - 12:00 PM',
            desc: 'To take care every customer to evening',
            bg: '#E8F0FE',
            color: '#007AFF',
        },
        {
            id: '2',
            title: 'Health Check',
            date: 'March 26 - 10:00 AM',
            desc: 'To take care office health checkup',
            bg: '#F2F8EA',
            color: '#34C759',
        },
    ];

    // Recent Activity Data
    const activityData = [
        {
            id: '1',
            icon: 'clock-start',
            color: '#007AFF',
            title: 'Start Shift',
            sub: '23 Feb 2023',
            time: '9:12 AM',
            status: 'Late',
        },
        {
            id: '2',
            icon: 'clock-end',
            color: '#34C759',
            title: 'End Shift',
            sub: '23 Feb 2023',
            time: '12:12 PM',
            status: 'Ontime',
        },
        {
            id: '3',
            icon: 'calendar-remove',
            color: '#FF3B30',
            title: 'Time Off',
            sub: 'Leave',
            time: '12 Mar - 14 Mar',
            status: 'Pending',
        },
    ];

    // Reusable Card Renderers
    const renderShiftCard = ({ item }) => (
        <View style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: '#EAF1FF' }]}>
                <Icon name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.label}>{item.label}</Text>
        </View>
    );

    const renderTaskCard = ({ item }) => (
        <View style={[styles.taskCard, { backgroundColor: item.bg }]}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <View style={styles.taskRow}>
                <Icon name="calendar" size={16} color={item.color} />
                <Text style={styles.taskDate}> {item.date}</Text>
            </View>
            <Text style={styles.taskDesc}>{item.desc}</Text>
        </View>
    );

    const renderActivityCard = ({ item }) => (
        <View style={styles.activityCard}>
            <View style={styles.activityLeft}>
                <Icon name={item.icon} size={22} color={item.color} />
                <View>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activitySub}>{item.sub}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.activityTime}>{item.time}</Text>
                <Text style={styles.activityStatus}>{item.status}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#001F54" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Employee Dashboard</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* Scrollable Content */}
            <FlatList
                ListHeaderComponent={
                    <>
                        {/* Profile Section */}
                        <View style={styles.profileSection}>
                            <View style={styles.headerLeft}>
                                <Image
                                    source={{
                                        uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                                    }}
                                    style={styles.profileImg}
                                />
                                <View>
                                    <Text style={styles.welcome}>Welcome Back!</Text>
                                    <Text style={styles.username}>Alex Cane</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bellIcon}>
                                <Icon name="bell-outline" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Shift Info */}
                        <View style={{ alignItems: 'center' }}>
                            <FlatList
                                data={shiftData}
                                horizontal
                                keyExtractor={(item) => item.id}
                                renderItem={renderShiftCard}
                                contentContainerStyle={styles.listRow}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>

                        {/* Attendance Summary */}
                        <View style={{ alignItems: 'center' }}>
                            <FlatList
                                data={attendanceData}
                                horizontal
                                keyExtractor={(item) => item.id}
                                renderItem={renderShiftCard}
                                contentContainerStyle={styles.listRow}
                                showsHorizontalScrollIndicator={false}
                            />
                            </View>

                            {/* Today Task */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Today Task</Text>
                                <TouchableOpacity>
                                    <Text style={styles.seeMore}>See More</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={taskData}
                                horizontal
                                keyExtractor={(item) => item.id}
                                renderItem={renderTaskCard}
                                contentContainerStyle={styles.listRow}
                                showsHorizontalScrollIndicator={false}
                            />

                            {/* Recent Activity */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Activity</Text>
                                <TouchableOpacity>
                                    <Text style={styles.seeMore}>View All</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                }
                        data={activityData}
                        keyExtractor={(item) => item.id}
                        renderItem={renderActivityCard}
                        contentContainerStyle={{ paddingBottom: 60 }}
                        showsVerticalScrollIndicator={false}
            />
                    </SafeAreaView>
                );
}

                const styles = StyleSheet.create({
                    container: {flex: 1, backgroundColor: '#001F54' },

                // Header
                header: {
                    flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#001F54',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                paddingVertical: 12,
                marginTop: 20,
    },
                headerTitle: {color: '#fff', fontSize: 18, fontWeight: '600' },

                profileSection: {
                    flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
    },
                headerLeft: {flexDirection: 'row', alignItems: 'center' },
                profileImg: {width: 45, height: 45, borderRadius: 25, marginRight: 10 },
                welcome: {color: 'white', fontSize: 13 },
                username: {color: 'white', fontSize: 16, fontWeight: '600' },
                bellIcon: {
                    backgroundColor: '#fff',
                padding: 8,
                borderRadius: 10,
                elevation: 2,
    },

                listRow: {
                    paddingHorizontal: 20,
    },

                card: {
                    backgroundColor: '#fff',
                width: 150,
                borderRadius: 12,
                paddingVertical: 18,
                paddingHorizontal: 15,
                marginRight: 15,
                marginVertical: 10,
                elevation: 3,
                alignItems: 'center',
    },
                cardIcon: {
                    backgroundColor: '#EAF1FF',
                padding: 8,
                borderRadius: 8,
                // alignSelf: 'flex-start',
                alignItems: 'center'

    },
                timeText: {fontSize: 18, fontWeight: '700', color: '#000', marginTop: 10 },
                label: {color: '#666', fontSize: 13, marginTop: 4 },

                sectionHeader: {
                    flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                marginTop: 20,
                alignItems: 'center',
    },
                sectionTitle: {fontSize: 17, fontWeight: '600', color: 'white' },
                seeMore: {color: '#007AFF', fontSize: 13 },

                taskCard: {
                    width: 220,
                borderRadius: 12,
                padding: 15,
                marginRight: 15,
                marginVertical: 10,
    },
                taskTitle: {fontWeight: '600', fontSize: 14, color: '#000' },
                taskRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4 },
                taskDate: {fontSize: 12, color: '#555' },
                taskDesc: {fontSize: 12, color: '#777', marginTop: 5 },

                activityCard: {
                    backgroundColor: '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 15,
                marginHorizontal: 20,
                marginVertical: 8,
                borderRadius: 12,
                elevation: 2,
    },
                activityLeft: {flexDirection: 'row', alignItems: 'center', gap: 10 },
                activityTitle: {fontSize: 14, fontWeight: '600', color: '#000' },
                activitySub: {fontSize: 12, color: '#666' },
                activityTime: {fontSize: 14, fontWeight: '600', color: '#000' },
                activityStatus: {fontSize: 12, color: '#999', textAlign: 'right' },
});
