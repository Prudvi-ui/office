import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import Toast from "react-native-toast-message";

export default function HelpSupportScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');

  const faqData = [
    { id: '1', question: 'How to mark attendance?', answer: 'Go to Attendance tab and tap on “Mark Attendance”.' },
    { id: '2', question: 'How to apply for leave?', answer: 'Open Leave Management, click “Apply Leave” and select dates.' },
    { id: '3', question: 'How to reset password?', answer: 'Go to Profile → Change Password and update it easily.' },
    { id: '4', question: 'How to contact HR?', answer: 'Use the support form below or email hr@company.com.' },
  ];

  const handleSubmit = () => {
    if (!issueType || !description) {
      Toast.show({
        type: "error",
        text1: "Missing Fields ⚠️",
        text2: "Please fill in all fields before submitting.",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Query Submitted ✅",
      text2: "Your issue has been submitted successfully!",
    });

    setIssueType('');
    setDescription('');
    setModalVisible(false);
  };
  const renderFAQItem = ({ item }) => (
    <Card style={styles.card}>
      <TouchableOpacity>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.answer}>{item.answer}</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Quick Help Section */}
        <Text style={styles.sectionTitle}>Quick Help</Text>
        <View style={styles.quickHelpRow}>
          <TouchableOpacity style={styles.quickHelpCard}>
            <Icon name="email-outline" size={28} color="#001F54" />
            <Text style={styles.quickText}>Contact HR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickHelpCard} onPress={() => setModalVisible(true)}>
            <Icon name="message-alert-outline" size={28} color="#001F54" />
            <Text style={styles.quickText}>Submit Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickHelpCard}>
            <Icon name="file-document-outline" size={28} color="#001F54" />
            <Text style={styles.quickText}>Policies</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <FlatList
          data={faqData}
          renderItem={renderFAQItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* Contact Info */}
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Need more help?</Text>
          <Text style={styles.contactText}>Email: support@company.com</Text>
          <Text style={styles.contactText}>Phone: +91 98765 43210</Text>
        </View>
      </ScrollView>

      {/* Modal for Submit Query */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Submit an Issue</Text>

            <TextInput
              placeholder="Issue Type (e.g. Attendance, Salary)"
              value={issueType}
              onChangeText={setIssueType}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Describe your issue"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholderTextColor="#666"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001F54' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001F54',
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginTop: 20
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10, color: '#001F54' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  question: { fontWeight: 'bold', fontSize: 15, color: '#000' },
  answer: { fontSize: 14, color: '#333', marginTop: 5 },
  quickHelpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickHelpCard: {
    width: '31%',
    backgroundColor: '#e6ecff',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 20,
  },
  quickText: { fontSize: 13, fontWeight: '500', marginTop: 5, color: '#001F54' },
  contactBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  contactTitle: { fontWeight: 'bold', fontSize: 15, color: '#001F54' },
  contactText: { fontSize: 14, marginTop: 5, color: '#333' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#001F54', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  submitBtn: {
    backgroundColor: '#001F54',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
