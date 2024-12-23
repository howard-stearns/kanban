import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet,
  Platform,
  ScrollView
} from 'react-native';

const TaskPropertyForm = ({ 
  values, 
  onValueChange, 
  dueDateLabel = "Due Date",
  containerStyle = {}
}) => {
  const renderDateInput = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={values.due.toISOString().split('T')[0]}
          onChange={(e) => onValueChange('due', new Date(e.target.value))}
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
    } 
    // Add iOS/Android specific implementations here if needed
  };

  return (
    <ScrollView style={containerStyle}>
      <View style={styles.field}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={values.name}
          onChangeText={(text) => onValueChange('name', text)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={values.description}
          onChangeText={(text) => onValueChange('description', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{dueDateLabel}:</Text>
        {renderDateInput()}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Assignee:</Text>
        <TextInput
          style={styles.input}
          value={values.assignee}
          onChangeText={(text) => onValueChange('assignee', text)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Categories (comma-separated):</Text>
        <TextInput
          style={styles.input}
          value={values.categories.join(', ')}
          onChangeText={(text) => {
            const categories = text.split(',').map(cat => cat.trim());
            onValueChange('categories', categories);
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default TaskPropertyForm;
