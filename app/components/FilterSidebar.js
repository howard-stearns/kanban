import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Animated,
} from 'react-native';
import TaskPropertyForm from './TaskPropertyForm';
import { Task } from '../models';

const FilterSidebar = ({ visible, onDismiss, onApplyFilter }) => {
  const [filterValues, setFilterValues] = useState({
    name: '',
    description: '',
    due: new Date(),
    assignee: '',
    categories: []
  });

  // Animation setup
  const [slideAnim] = useState(new Animated.Value(visible ? 0 : 300));

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleValueChange = (field, value) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    console.log(filterValues, Task);
    onApplyFilter(task =>
      (!filterValues.name || task.name.includes(filterValues.name)) && 
      (!filterValues.description || task.description.includes(filterValues.description)) && 
      (!filterValues.assignee || task.assignee.includes(filterValues.assignee)) && 
      (!filterValues.categories.length || filterValues.categories.every(
        required => task.categories.some(category => category.includes(required))
      )) && 
      (task.due === Task.endOfTheWorld || task.due <= filterValues.due)
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.dismissArea} onPress={onDismiss} />
      <Animated.View style={[
        styles.sidebar,
        { transform: [{ translateX: slideAnim }] }
      ]}>
        <Text style={styles.title}>Filter Tasks</Text>
        <TaskPropertyForm
          values={filterValues}
          onValueChange={handleValueChange}
          dueDateLabel="Due Before"
          containerStyle={styles.form}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.dismissButton]} 
            onPress={onDismiss}
          >
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.applyButton]} 
            onPress={handleApply}
          >
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 1000,
  },
  dismissArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    flex: 1,
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
  dismissButton: {
    backgroundColor: '#ff3b30',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FilterSidebar;
