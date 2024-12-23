import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Board } from './models.js';
import KanbanBoard from './components/KanbanBoard';
import FilterSidebar from './components/FilterSidebar';

const CONFIG = {
  COLUMN_WIDTH: 300,
  TASK_HEIGHT: 60,
  COLUMN_MARGIN: 1,
  TASK_MARGIN: 1,
};

export default function App() {
  const [board] = useState(() => Board.makeExample(3, 3));
  const [filterVisible, setFilterVisible] = useState(false);

  const handleApplyFilter = useCallback((filterFn) => {
    board.applyFilter(filterFn);
    setFilterVisible(false);
    // Force re-render of the board
    setBoardKey(prev => prev + 1);
  }, [board]);

  const [boardKey, setBoardKey] = useState(0);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <KanbanBoard 
        key={boardKey}
        board={board}
        config={CONFIG}
      />

      <FilterSidebar
        visible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        onApplyFilter={handleApplyFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    zIndex: 100,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
