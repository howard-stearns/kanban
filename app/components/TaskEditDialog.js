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
import TaskPropertyForm from './TaskPropertyForm';

const TaskEditDialog = ({ visible, task, onCancel, onOk }) => {
  const [editedValues, setEditedValues] = useState({
    name: '',
    description: '',
    due: new Date(),
    assignee: '',
    categories: []
  });

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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TaskPropertyForm
            values={editedValues}
            onValueChange={(field, value) => {
              setEditedValues(prev => ({
                ...prev,
                [field]: value
              }));
            }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.okButton]} 
              onPress={() => onOk(editedValues)}
            >
              <Text style={styles.buttonText}>OK</Text>
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
