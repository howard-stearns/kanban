import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';

const TaskEditDialog = ({ visible, task, onCancel, onOk }) => {
  const [editedValues, setEditedValues] = useState({
    name: '',
    description: '',
    due: new Date(),
    assignee: '',
    categories: []
  });

  // Reset edited values when dialog opens
  React.useEffect(() => {
    if (visible) {
      setEditedValues({
        name: task.name || '',
        description: task.description || '',
        due: task.due || new Date(),
        assignee: task.assignee || '',
        categories: task.categories || []
      });
    }
  }, [visible, task]);

  const handleTextChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (text) => {
    // Split by commas and trim whitespace, but keep empty entries
    const categories = text.split(',').map(cat => cat.trim());
    setEditedValues(prev => ({
      ...prev,
      categories
    }));
  };

  const handleDateChange = () => {
    if (Platform.OS === 'web') {
      // For web, use a simple date input
      return;
    }
    // Platform specific date picker code here...
  };

  const renderDateInput = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={editedValues.due.toISOString().split('T')[0]}
          onChange={(e) => handleTextChange('due', new Date(e.target.value))}
          style={{
            padding: 8,
            fontSize: 14,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 4,
            width: '100%'
          }}
        />
      );
    } else if (Platform.OS === 'ios') {
      return (
        <DatePickerIOS
          date={editedValues.due}
          onDateChange={(date) => handleTextChange('due', date)}
          mode="date"
        />
      );
    } else {
      // Android
      return (
        <TouchableOpacity onPress={handleDateChange}>
          <Text style={styles.dateText}>
            {editedValues.due.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.field}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={editedValues.name}
                onChangeText={(text) => handleTextChange('name', text)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description:</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={editedValues.description}
                onChangeText={(text) => handleTextChange('description', text)}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Due Date:</Text>
              {renderDateInput()}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Assignee:</Text>
              <TextInput
                style={styles.input}
                value={editedValues.assignee}
                onChangeText={(text) => handleTextChange('assignee', text)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Categories (comma-separated):</Text>
              <TextInput
                style={styles.input}
                value={editedValues.categories.join(', ')}
                onChangeText={handleCategoryChange}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.okButton]} 
              onPress={() => onOk(editedValues)}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  okButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TaskEditDialog;
