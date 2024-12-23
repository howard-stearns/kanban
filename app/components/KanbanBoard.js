import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Column from './Column';

const KanbanBoard = ({ board, config }) => {
  const renderColumn = ({ item: column, index }) => (
    <Column 
      column={column}
      config={config}
      index={index}
    />
  );

  return (
    <FlatList
      horizontal
      data={board.filtered}
      renderItem={renderColumn}
      keyExtractor={column => `column-${column.id}`}
      getItemLayout={(data, index) => ({
        length: config.COLUMN_WIDTH,
        offset: config.COLUMN_WIDTH * index,
        index,
      })}
      windowSize={1 + (2 * config.COLUMN_MARGIN)}
      maxToRenderPerBatch={1 + (2 * config.COLUMN_MARGIN)}
      initialNumToRender={1 + (2 * config.COLUMN_MARGIN)}
    />
  );
};

export default KanbanBoard;
