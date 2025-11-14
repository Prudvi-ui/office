import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar } from "react-native-calendars";

export default function AttendanceScreen({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState("2025-11-01");
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);

  // ✅ Sample attendance data
  const attendanceData = {
    "2025-11-05": { marked: true, dotColor: "red", status: "absent" },
    "2025-11-06": { marked: true, dotColor: "green", status: "present" },
    "2025-11-07": { marked: true, dotColor: "green", status: "present" },
    "2025-11-09": { marked: true, dotColor: "green", status: "present" },
    "2025-11-12": { marked: true, dotColor: "green", status: "present" },
    "2025-11-15": { marked: true, dotColor: "red", status: "absent" },
    "2025-11-19": { marked: true, dotColor: "green", status: "present" },
    "2025-11-26": { marked: true, dotColor: "red", status: "absent" },
  };

  // ✅ Calculate totals
  useEffect(() => {
    const values = Object.values(attendanceData);
    const presentDays = values.filter((d) => d.status === "present").length;
    const absentDays = values.filter((d) => d.status === "absent").length;
    setPresentCount(presentDays);
    setAbsentCount(absentDays);
  }, []);

  // ✅ Memoize markedDates
  const markedDates = useMemo(() => {
    const dates = {};
    for (const key in attendanceData) {
      dates[key] = {
        marked: true,
        dotColor: attendanceData[key].dotColor,
      };
    }
    return dates;
  }, []);

  // ✅ Check-in / Check-out logic
  const handleCheckInOut = () => {
    const now = new Date();
    if (!checkedIn) {
      setCheckedIn(true);
      setCheckInTime(now);
      setElapsedTime(0);
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      setTimer(interval);
    } else {
      setCheckedIn(false);
      setCheckOutTime(now);
      if (timer) clearInterval(timer);
      setTimer(null);
    }
  };

  // ✅ Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDisplayTime = (date) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ✅ UI
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance</Text>
          <Text style={styles.headerTitle}></Text>

        </View>

        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.profileSection}>
            <Image
              source={require("../Images/Profile1.png")}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>Tester</Text>
          </View>

          <View style={styles.attendancePercent}>
            <Text style={styles.percentText}>
              {(
                (presentCount / (presentCount + absentCount)) * 100 || 0
              ).toFixed(2)}
              %
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarWrapper}>
          <Calendar
            current={selectedMonth}
            onMonthChange={(month) => setSelectedMonth(month.dateString)}
            markedDates={markedDates}
            markingType={"dot"}
            theme={{
              calendarBackground: "#FFFFFF",
              textSectionTitleColor: "#333",
              todayTextColor: "#0A3D91",
              dayTextColor: "#222",
              textDisabledColor: "#d9e1e8",
              monthTextColor: "#000",
              indicatorColor: "#0A3D91",
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
              arrowColor: "#0A3D91",
            }}
          />
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Presents</Text>
            <Text style={[styles.summaryValue, { color: "#22C55E" }]}>
              {presentCount}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Absents</Text>
            <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
              {absentCount}
            </Text>
          </View>
        </View>

        {/* Check-in / Check-out */}
        {/* <View style={styles.checkSection}>
          <Text style={styles.checkTitle}>
            {checkedIn ? "Check out" : "Check in"}
          </Text>

          <TouchableOpacity
            style={[
              styles.checkButton,
              { backgroundColor: checkedIn ? "#E74C3C" : "#2ECC71" },
            ]}
            onPress={handleCheckInOut}
          >
            <Icon name="hand-pointing-up" size={36} color="#fff" />
            <Text style={styles.checkText}>
              {checkedIn ? "Check out" : "Check in"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.dateText}>{today}</Text>
          <Text style={styles.timeText}>
            {checkedIn
              ? formatTime(elapsedTime)
              : checkInTime && checkOutTime
                ? "Work Complete"
                : "00:00:00"}
          </Text>

          {/* Bottom stats */}
          {/* <View style={styles.bottomRow}>
            <View style={styles.bottomItem}>
              <Icon name="clock-outline" size={22} color="#2ECC71" />
              <Text style={styles.bottomTime}>
                {formatDisplayTime(checkInTime)}
              </Text>
              <Text style={styles.bottomLabel}>Check in</Text>
            </View>
            <View style={styles.bottomItem}>
              <Icon name="clock-outline" size={22} color="#E74C3C" />
              <Text style={styles.bottomTime}>
                {formatDisplayTime(checkOutTime)}
              </Text>
              <Text style={styles.bottomLabel}>Check out</Text>
            </View>
            <View style={styles.bottomItem}>
              <Icon name="clock-time-eight-outline" size={22} color="#3498DB" />
              <Text style={styles.bottomTime}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.bottomLabel}>Total Time</Text>
            </View>
          </View> */}
        {/* </View> */} 

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#001F54",
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600", marginTop: 20 },
  profileImage: { width: 36, height: 36, borderRadius: 18 },
  topSection: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileSection: { flexDirection: "row", alignItems: "center" },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#0c1247",
    right: 10,
  },
  userName: { color: "#0c1247", fontSize: 18, fontWeight: "500", marginLeft: 10 },
  attendancePercent: { alignItems: "center" },
  percentText: { color: "#0c1247", fontSize: 22, fontWeight: "700" },
  calendarWrapper: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 15,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 12,
    paddingVertical: 15,
    elevation: 3,
  },
  summaryBox: { alignItems: "center" },
  summaryTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  summaryValue: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  checkSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 25,
  },
  checkTitle: { fontSize: 18, fontWeight: "600", color: "#000", marginBottom: 15 },
  checkButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    elevation: 5,
  },
  checkText: { color: "#fff", fontSize: 17, fontWeight: "600", marginTop: 6 },
  dateText: { color: "#444", fontSize: 15, marginTop: 8 },
  timeText: { color: "#000", fontSize: 22, fontWeight: "700", marginTop: 5 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    gap: 30
  },
  bottomItem: { alignItems: "center" },
  bottomTime: { fontSize: 16, fontWeight: "600", color: "#000", marginTop: 5 },
  bottomLabel: { color: "#666", fontSize: 13 },
});
