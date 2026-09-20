import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { RideMode, RideRule, CreateRuleInput } from "./types";
import { createRule, listRules } from "./api";

const MODES: RideMode[] = ["auto", "cab", "bike"];

// Happy path only: no validation beyond "required", no error UI beyond a
// console log, no date picker (plain text input for the datetime).
// See backend/README.md for what's deliberately left out and why —
// the same list applies here.
export function App() {
  const [pickupLabel, setPickupLabel] = useState("Home");
  const [dropLabel, setDropLabel] = useState("Office");
  const [targetTime, setTargetTime] = useState(""); // e.g. 2026-09-25T18:00
  const [leadTimeMinutes, setLeadTimeMinutes] = useState("15");
  const [modePreference, setModePreference] = useState<RideMode>("auto");
  const [submitting, setSubmitting] = useState(false);
  const [rules, setRules] = useState<RideRule[]>([]);

  async function refresh() {
    try {
      setRules(await listRules());
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const input: CreateRuleInput = {
        userId: "cat-eyes", // hardcoded until auth exists
        pickup: { lat: 12.9351, lng: 77.6146, label: pickupLabel },
        drop: { lat: 12.9698, lng: 77.75, label: dropLabel },
        targetTime: new Date(targetTime).toISOString(),
        leadTimeMinutes: Number(leadTimeMinutes) || 15,
        modePreference,
      };
      await createRule(input);
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Auto Ride Scheduler</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Pickup</Text>
          <TextInput
            style={styles.input}
            value={pickupLabel}
            onChangeText={setPickupLabel}
          />

          <Text style={styles.label}>Drop</Text>
          <TextInput
            style={styles.input}
            value={dropLabel}
            onChangeText={setDropLabel}
          />

          <Text style={styles.label}>Target time (YYYY-MM-DDTHH:mm)</Text>
          <TextInput
            style={styles.input}
            value={targetTime}
            onChangeText={setTargetTime}
            placeholder="2026-09-25T18:00"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Lead time (minutes before)</Text>
          <TextInput
            style={styles.input}
            value={leadTimeMinutes}
            onChangeText={setLeadTimeMinutes}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Mode</Text>
          <View style={styles.modeRow}>
            {MODES.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeButton,
                  modePreference === mode && styles.modeButtonActive,
                ]}
                onPress={() => setModePreference(mode)}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    modePreference === mode && styles.modeButtonTextActive,
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "Creating..." : "Create rule"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={rules}
          keyExtractor={(rule) => rule.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No rules yet — create one above.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.ruleCard}>
              <Text style={styles.ruleRoute}>
                {item.pickup.label} → {item.drop.label}
              </Text>
              <Text style={styles.ruleMeta}>
                {new Date(item.targetTime).toLocaleString()} ·{" "}
                {item.modePreference} · {item.status}
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  scroll: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  form: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  label: { fontSize: 13, color: "#444", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  modeRow: { flexDirection: "row", gap: 8 },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  modeButtonActive: { backgroundColor: "#111", borderColor: "#111" },
  modeButtonText: { color: "#111" },
  modeButtonTextActive: { color: "white" },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#111",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  ruleCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  ruleRoute: { fontWeight: "600" },
  ruleMeta: { fontSize: 12, color: "#666", marginTop: 4 },
  empty: { color: "#888", fontSize: 14 },
});
