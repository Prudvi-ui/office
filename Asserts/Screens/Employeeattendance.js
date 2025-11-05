import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar } from "react-native-calendars";

export default function AttendanceScreen({navigation}) {
  const [selectedMonth, setSelectedMonth] = useState("2025-11-01");
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  // ✅ Attendance data (constant, not changing between renders)
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

  // ✅ Calculate totals only once
  useEffect(() => {
    const values = Object.values(attendanceData);
    const presentDays = values.filter((d) => d.status === "present").length;
    const absentDays = values.filter((d) => d.status === "absent").length;
    setPresentCount(presentDays);
    setAbsentCount(absentDays);
  }, []);

  // ✅ Build markedDates safely
  const markedDates = React.useMemo(() => {
    const dates = {};
    for (const key in attendanceData) {
      dates[key] = {
        marked: true,
        dotColor: attendanceData[key].dotColor,
      };
    }
    return dates;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{marginTop:20}} onPress={() =>navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity >
        <Text style={styles.headerTitle}>Attendance</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Profile & Attendance */}
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
            {((presentCount / (presentCount + absentCount)) * 100 || 0).toFixed(2)}%
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

      {/* ✅ Present / Absent Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Presents</Text>
          <Text style={[styles.summaryValue, { color: "#22C55E" }]}>{presentCount}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Absents</Text>
          <Text style={[styles.summaryValue, { color: "#EF4444" }]}>{absentCount}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#001F54'},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor:'#001F54'
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600",marginTop:20 },
//   profileImage: { width: 36, height: 36, borderRadius: 18 },
  topSection: {
    backgroundColor: "#001F54",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileSection: { flexDirection: "row", alignItems: "center" },
  userAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: "#fff",right:10 },
  userName: { color: "#fff", fontSize: 18, fontWeight: "500", marginLeft: 10 },
  attendancePercent: { alignItems: "center" },
  percentText: { color: "#fff", fontSize: 22, fontWeight: "700" },
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
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryBox: { alignItems: "center" },
  summaryTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  summaryValue: { fontSize: 20, fontWeight: "700", marginTop: 4 },
});
