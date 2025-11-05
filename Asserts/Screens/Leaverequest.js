import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform,
    Modal,
    Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';

export default function UpdateLeaveForm({ navigation }) {
    const [leaveFrom, setLeaveFrom] = useState(new Date());
    const [leaveTo, setLeaveTo] = useState(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [reason, setReason] = useState('');

    const onChangeFrom = (event, selectedDate) => {
        const currentDate = selectedDate || leaveFrom;
        setShowFromPicker(Platform.OS === 'ios');
        setLeaveFrom(currentDate);
    };

    const onChangeTo = (event, selectedDate) => {
        const currentDate = selectedDate || leaveTo;
        setShowToPicker(Platform.OS === 'ios');
        setLeaveTo(currentDate);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Update Leave Form</Text>
                <View />
            </View>

            <View style={styles.container}>
                {/* Leave From */}
                <Text style={styles.label}>Leave from</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowFromPicker(true)}>
                    <Text style={styles.inputText}>{formatDate(leaveFrom)}</Text>
                    <Icon name="calendar" size={22} color="#555" />
                </TouchableOpacity>

                {/* Leave To */}
                <Text style={styles.label}>Leave to</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowToPicker(true)}>
                    <Text style={styles.inputText}>{formatDate(leaveTo)}</Text>
                    <Icon name="calendar" size={22} color="#555" />
                </TouchableOpacity>

                {/* Leave Type */}
                <Text style={styles.label}>Leave type</Text>
                <View style={styles.dropdown}>
                    <Picker
                        selectedValue={leaveType}
                        onValueChange={(itemValue) => setLeaveType(itemValue)}>
                        <Picker.Item label="Sick Leave" value="Sick Leave" />
                        <Picker.Item label="Casual Leave" value="Casual Leave" />
                        <Picker.Item label="Annual Leave" value="Annual Leave" />
                        <Picker.Item label="Emergency Leave" value="Emergency Leave" />
                    </Picker>
                </View>

                {/* Reason */}
                <Text style={styles.label}>Reason</Text>
                <TextInput
                    style={[styles.inputBox, { height: 100 }]}
                    multiline
                    placeholder="Enter reason"
                    value={reason}
                    onChangeText={setReason}
                />

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.cancelBtn]}>
                        <Text style={styles.cancelText}>Cancel Leave</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.updateBtn]}>
                        <Text style={styles.updateText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Date Pickers */}
            {showFromPicker && (
                <DateTimePicker
                    value={leaveFrom}
                    mode="date"
                    display="default"
                    onChange={onChangeFrom}
                />
            )}

            {showToPicker && (
                <DateTimePicker
                    value={leaveTo}
                    mode="date"
                    display="default"
                    onChange={onChangeTo}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#001F54' },
    header: {
        backgroundColor: '#001F54',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginTop: 20
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
    container: { padding: 20 },
    label: { color: 'white', fontSize: 15, fontWeight: '500', marginTop: 15 },
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        padding: 12,
        marginTop: 6,
        backgroundColor: 'white'

    },
    inputText: { color: 'black', fontSize: 15 },
    dropdown: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        marginTop: 6,
        backgroundColor: 'white'

    },
    inputBox: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        marginTop: 6,
        padding: 10,
        textAlignVertical: 'top',
        backgroundColor: 'white'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    button: {
        flex: 1,
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelBtn: {
        backgroundColor: 'white',
        color: 'black '
    },
    updateBtn: {
        backgroundColor: 'white',
    },
    cancelText: {
        color: 'black',
        fontWeight: '600',
    },
    updateText: {
        color: 'black',
        fontWeight: '600',
    },
});
