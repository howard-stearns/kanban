import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Board } from './models.js';
import KanbanBoard from './components/KanbanBoard';

// Configuration parameters
const CONFIG = {
  COLUMN_WIDTH: 300,
  TASK_HEIGHT: 120,
  COLUMN_MARGIN: 1,
  TASK_MARGIN: 1,
};

export default function App() {
  const [board] = useState(() => Board.makeExample(10, 1000));
  const [filter, setFilter] = useState(null);

  const applyFilter = useCallback((newFilter) => {
    if (newFilter) {
      board.applyFilter(newFilter);
    }
    setFilter(newFilter);
  }, [board]);

  return (
    <View style={styles.container}>
      <KanbanBoard 
        board={board}
        config={CONFIG}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
