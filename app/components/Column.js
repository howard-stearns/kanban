import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Task from './Task';

const Column = ({ column, config, index }) => {
  const renderTask = ({ item: task }) => (
    <Task 
      task={task}
      config={config}
    />
  );

  return (
    <View style={[styles.column, { width: config.COLUMN_WIDTH }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{column.name}</Text>
      </View>
      <FlatList
        data={column.filtered}
        renderItem={renderTask}
        keyExtractor={task => `task-${task.id}`}
        getItemLayout={(data, index) => ({
          length: config.TASK_HEIGHT,
          offset: config.TASK_HEIGHT * index,
          index,
        })}
        windowSize={1 + (2 * config.TASK_MARGIN)}
        maxToRenderPerBatch={1 + (2 * config.TASK_MARGIN)}
        initialNumToRender={1 + (2 * config.TASK_MARGIN)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
  },
  header: {
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Column;
