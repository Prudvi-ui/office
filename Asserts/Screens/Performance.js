import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, ProgressBar } from 'react-native-paper';

export default function EmployeePerformanceScreen({ navigation }) {
  const performanceData = [
    { id: 1, category: 'Attendance', score: 0.9 },
    { id: 2, category: 'Task Completion', score: 0.8 },
    { id: 3, category: 'Team Collaboration', score: 0.85 },
    { id: 4, category: 'Discipline', score: 0.95 },
  ];

  const feedbackList = [
    { id: '1', feedback: 'Excellent consistency in meeting deadlines.' },
    { id: '2', feedback: 'Great teamwork and communication this quarter.' },
    { id: '3', feedback: 'Keep improving task prioritization skills.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" style={{ marginTop: 20 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Performance</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Performance Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Overall Rating</Text>
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name={i < 4 ? 'star' : 'star-outline'}
                color="#FFD700"
                size={28}
              />
            ))}
            <Text style={styles.ratingText}>4.0 / 5</Text>
          </View>
          <Text style={styles.summaryDesc}>
            Great performance this quarter! Keep up the good work.
          </Text>
        </Card>

        {/* Category Performance */}
        <Text style={styles.sectionTitle}>Performance Breakdown</Text>
        {performanceData.map((item) => (
          <Card key={item.id} style={styles.categoryCard}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryTitle}>{item.category}</Text>
              <Text style={styles.scoreText}>{(item.score * 100).toFixed(0)}%</Text>
            </View>
            <ProgressBar progress={item.score} color="#001F54" style={styles.progressBar} />
          </Card>
        ))}

        {/* Feedback Section */}
        <Text style={styles.sectionTitle}>Recent Feedback</Text>
        {feedbackList.map((item) => (
          <Card key={item.id} style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>• {item.feedback}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001F54',
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    height: 80
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  content: { padding: 15 },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 15,
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#001F54' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingText: { fontSize: 15, marginLeft: 8, color: '#333', fontWeight: '600' },
  summaryDesc: { marginTop: 10, color: '#555', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#001F54', marginVertical: 10 },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  categoryTitle: { fontSize: 15, fontWeight: '600', color: '#000' },
  scoreText: { fontSize: 14, fontWeight: 'bold', color: '#001F54' },
  progressBar: { height: 8, borderRadius: 5 },
  feedbackCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  feedbackText: { fontSize: 14, color: '#333' },
});
