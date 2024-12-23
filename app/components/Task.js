import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import TaskEditDialog from './TaskEditDialog';

const Task = ({ task, config }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handlePress = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleOk = (updatedValues) => {
    Object.assign(task, updatedValues);
    setIsEditing(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        <View style={[styles.task, { height: config.TASK_HEIGHT }]}>
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.taskDescription} numberOfLines={2}>{task.description}</Text>
          {task.assignee ? (
            <Text style={styles.taskAssignee}>Assigned to: {task.assignee}</Text>
          ) : null}
          {task.categories.length > 0 ? (
            <View style={styles.categoriesContainer}>
              {task.categories.map(category => (
                <Text key={category} style={styles.category}>{category}</Text>
              ))}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      <TaskEditDialog
        visible={isEditing}
        task={task}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </>
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
  taskName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 12,
    color: '#666',
  },
  taskAssignee: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  category: {
    fontSize: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginTop: 2,
  },
});

export default Task;
