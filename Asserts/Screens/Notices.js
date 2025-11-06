import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const notices = [
  {
    id: '1',
    title: 'Office closed for maintenance on Friday',
    date: '02 March 2025',
    image: 'https://cdn-icons-png.flaticon.com/512/2729/2729007.png',
    color: '#E3F2FD',
  },
  {
    id: '2',
    title: 'Quarterly Team Meetup in June',
    date: '02 March 2025',
    image: 'https://cdn-icons-png.flaticon.com/512/2920/2920256.png',
    color: '#E8F5E9',
  },
  {
    id: '3',
    title: 'New Project Launch: Alpha Suite',
    date: '02 March 2025',
    image: 'https://cdn-icons-png.flaticon.com/512/2965/2965358.png',
    color: '#FFF3E0',
  },
  {
    id: '4',
    title: 'Employee Wellness Workshop',
    date: '02 March 2025',
    image: 'https://cdn-icons-png.flaticon.com/512/2784/2784465.png',
    color: '#FCE4EC',
  },
  {
    id: '5',
    title: 'Hackathon 2025 — Register Now!',
    date: '02 March 2025',
    image: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png',
    color: '#E1F5FE',
  },
  {
    id: '6',
    title: 'New Remote Work Policy Update',
    date: '02 March 2025',
    image: 'https://cdn-icons-png.flaticon.com/512/2821/2821637.png',
    color: '#F3E5F5',
  },
];

export default function NoticeBoard({ navigation }) {
  const renderNotice = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A148C" barStyle="light-content" />
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notice</Text>
        <View style={{ width: 26 }} /> {/* spacing placeholder */}
      </View>

      {/* Notice List */}
      <FlatList
        data={notices}
        renderItem={renderNotice}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F54',
  },
  header: {
    backgroundColor: '#001F54',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop:20
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});
