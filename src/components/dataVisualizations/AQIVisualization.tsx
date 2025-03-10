import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {getAQIRanges} from '../../data/AQIStandard';

interface AQIVisualizationProps {
  AQI: number;
  style?: object;
}

const AQIVisualization: React.FC<AQIVisualizationProps> = ({AQI, style}) => {
  const {colors} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const fill = (AQI / 500) * 100;

  let tintColor = colors.primary;
  const AQIRanges = getAQIRanges();
  for (let i = 0; i < AQIRanges.length; i++) {
    if (AQI >= AQIRanges[i].min && AQI <= AQIRanges[i].max) {
      tintColor = AQIRanges[i].color;
      break;
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, {color: colors.primary}]}>
        Air Quality Index
      </Text>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <AnimatedCircularProgress
          size={160}
          width={10}
          backgroundWidth={15}
          fill={fill}
          tintColor={tintColor}
          backgroundColor={colors.text}
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
          style={styles.AQIProgressBar}>
          {() => (
            <Text style={[styles.AQIText, {color: colors.text}]}>{AQI}</Text>
          )}
        </AnimatedCircularProgress>
      </TouchableOpacity>

      {/* AQI Info Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Air Quality Index</Text>
              <ScrollView style={styles.scrollView}>
                {AQIRanges.map((range, index) => (
                  <View key={index} style={styles.rangeItem}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                      <View
                        style={[
                          styles.colorIndicator,
                          {backgroundColor: range.color},
                        ]}
                      />
                      <Text style={styles.rangeText}>
                        {range.label}: {range.min} - {range.max}
                      </Text>
                    </View>
                    <Text style={styles.description}>{range.description}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.closeButton, {backgroundColor: colors.primary}]}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={[styles.closeButtonText, {color: colors.background}]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pointer} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  AQIProgressBar: {
    alignSelf: 'center',
  },
  AQIText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    marginTop: 120,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15, // Change from borderBottomWidth to borderTopWidth
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff', // Change to top color
    marginTop: -1, // Adjust for alignment
    zIndex: 1,
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollView: {
    marginVertical: 10,
  },
  rangeItem: {
    marginBottom: 15,
  },
  colorIndicator: {
    width: 12,
    aspectRatio: 1,
    borderRadius: 12 / 2,
    marginBottom: 5,
  },
  rangeText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    fontSize: 12,
    color: '#555',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});

export default AQIVisualization;
