import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

type TopLeast = {
  name: string;
  transactions: number;
  totalAmount: number;
  percentage: number;
};

type AnalyticsData = {
  topUsed: TopLeast[];
  leastUsed: TopLeast[];
  usageBreakdown: Record<string, number>;
};

interface ForecastStats {
  totalPredictedSentAmount: number;
  totalPredictedReceivedAmount: number;
  totalPredictedSentCount: number;
  totalPredictedReceivedCount: number;
}

interface UserInfo {
  name: string;
  email: string;
}

interface AnalyticsReportProps {
  user: UserInfo | null;
  forecastStats: ForecastStats;
  analytics: AnalyticsData | null;
  forecastChartImg: string | null;
  pieChartImg: string | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  headerBanner: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 6,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#ffffff",
    fontSize: 10,
    marginTop: 2,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
    marginTop: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 10,
  },
  userInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  userInfoCol: {
    width: "50%",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 10,
    color: "#1e293b",
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  kpiCard: {
    width: "48%",
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#10b981",
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 8,
    color: "#64748b",
  },
  kpiValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 2,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 8,
  },
  chartImage: {
    width: "100%",
    height: 180,
  },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  methodName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    width: "30%",
  },
  methodDetails: {
    fontSize: 9,
    color: "#64748b",
    width: "70%",
    textAlign: "right",
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    width: "100%",
    marginTop: 2,
    marginBottom: 6,
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#64748b",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 5,
  },
});

const formatNumber = (num: number) => {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  let result = "";
  if (absNum >= 1_000_000) {
    result = `${(absNum / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  } else if (absNum >= 1_000) {
    result = `${(absNum / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  } else {
    result = absNum.toFixed(0);
  }
  return isNegative ? `-${result}` : result;
};

export default function AnalyticsReport({
  user,
  forecastStats,
  analytics,
  forecastChartImg,
  pieChartImg,
}: AnalyticsReportProps) {
  const topUsed = analytics?.topUsed ?? [];
  const leastUsed = analytics?.leastUsed ?? [];

  return (
    <Document>
      {/* PAGE 1: Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>CentralPay</Text>
          <Text style={styles.headerSubtitle}>
            Analytics & Forecast Executive Report
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Account Profile</Text>
        <View style={styles.divider} />
        <View style={styles.userInfoGrid}>
          <View style={styles.userInfoCol}>
            <Text style={styles.infoLabel}>Client Name</Text>
            <Text style={styles.infoValue}>{user?.name ?? "—"}</Text>
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{user?.email ?? "—"}</Text>
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>Active</Text>
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.infoLabel}>Service Provider</Text>
            <Text style={styles.infoValue}>CentralPay Gateway</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>48-Hour Forecast Predictions</Text>
        <View style={styles.divider} />
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Predicted Sent Volume</Text>
            <Text style={styles.kpiValue}>
              {formatNumber(forecastStats.totalPredictedSentAmount)} EGP
            </Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Predicted Received Volume</Text>
            <Text style={styles.kpiValue}>
              {formatNumber(forecastStats.totalPredictedReceivedAmount)} EGP
            </Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Predicted Sent Transactions</Text>
            <Text style={styles.kpiValue}>
              {formatNumber(forecastStats.totalPredictedSentCount)}
            </Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Predicted Received Transactions</Text>
            <Text style={styles.kpiValue}>
              {formatNumber(forecastStats.totalPredictedReceivedCount)}
            </Text>
          </View>
        </View>

        {pieChartImg && (
          <View>
            <Text style={styles.sectionTitle}>Payment Usage Breakdown</Text>
            <View style={styles.divider} />
            <View style={styles.chartContainer}>
              <Image src={pieChartImg} style={styles.chartImage} />
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          CentralPay Analytics Report • Page 1 of 2
        </Text>
      </Page>

      {/* PAGE 2: Payment Methods & Forecast Chart */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Top Used Payment Methods</Text>
        <View style={styles.divider} />
        {topUsed.length > 0 ? (
          topUsed.map((item) => (
            <View key={item.name} style={{ marginBottom: 4 }}>
              <View style={styles.methodRow}>
                <Text style={styles.methodName}>{item.name}</Text>
                <Text style={styles.methodDetails}>
                  {item.transactions} txns | Volume: {formatNumber(Math.abs(item.totalAmount))} EGP
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor: "#10b981",
                    },
                  ]}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 9, color: "#64748b", marginVertical: 10 }}>
            No top payment method data available.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Least Used Payment Methods</Text>
        <View style={styles.divider} />
        {leastUsed.length > 0 ? (
          leastUsed.map((item) => (
            <View key={item.name} style={{ marginBottom: 4 }}>
              <View style={styles.methodRow}>
                <Text style={styles.methodName}>{item.name}</Text>
                <Text style={styles.methodDetails}>
                  {item.transactions} txns | Volume: {formatNumber(Math.abs(item.totalAmount))} EGP
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor: "#f43f5e",
                    },
                  ]}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 9, color: "#64748b", marginVertical: 10 }}>
            No least payment method data available.
          </Text>
        )}

        {forecastChartImg && (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.sectionTitle}>48-Hour Forecast Trend</Text>
            <View style={styles.divider} />
            <View style={styles.chartContainer}>
              <Image src={forecastChartImg} style={styles.chartImage} />
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          CentralPay Analytics Report • Page 2 of 2
        </Text>
      </Page>
    </Document>
  );
}
