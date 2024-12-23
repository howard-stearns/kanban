import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Task = ({ task, config }) => {
  React.useEffect(() => console.log('render task', task, config));
  return (
    <View style={[styles.task, { height: config.TASK_HEIGHT }]}>
      <Text style={styles.taskLabel}>{task.label}</Text>
      <Text style={styles.taskText} numberOfLines={2}>{task.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: 'white',
    margin: 4,
    padding: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  taskLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskText: {
    fontSize: 12,
    color: '#666',
  },
});
export default Task;
