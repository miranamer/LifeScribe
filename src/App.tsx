import { Tree, TreeNode } from 'react-organizational-chart';
import { useState } from "react";
import Node from './Node'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react';

function App() {




  const [data, setData] = useState({
    text: '',
    children: [
      { text: 'make a game', children: [], date: Date.now() },
      { text: 'make a book', children: [], date: Date.now() }
    ]
  });

  const [displayedDates, setDisplayedDates] = useState([]);

  //const renderTree = (node) => (
    //<TreeNode label={<Node node={node} data={data} setData={setData} />}>
      //{node.children.map((child, index) => (
        //<>{renderTree(child)}</>
      //))}
    //</TreeNode>
  //);

  const [dateLevelsMap, setDateLevelsMap] = useState({});

  const renderTree = (node, level = 0) => {
    const dateTitle = renderDateTitle(node);

    return (
      <React.Fragment key={level}>
        {dateTitle}
        <TreeNode
          label={
            <Node
              node={node}
              data={data}
              setData={setData}
              displayedDates={displayedDates}
              setDisplayedDates={setDisplayedDates}
              dateLevelsMap={dateLevelsMap}
              level={level}
              onDateAdded={handleDateAdded}
            />
          }
        >
          {node.children.map((child, index) =>
            renderTree(child, level + 1)
          )}
        </TreeNode>
      </React.Fragment>
    );
  };

  // Use dateLevelsMap directly
  const renderDateTitle = (node, level) => {
    if (
      node.date &&
      displayedDates.includes(new Date(node.date).toLocaleDateString())
    ) {
      const dateLevel = dateLevelsMap[node.date];
      return (
        <div
          className={`date-title level-${dateLevel}`}
          style={{ left: `${level * 40}px` }} // Adjust the left position based on the level
        >
          {new Date(node.date).toLocaleDateString()}
        </div>
      );
    }
    return null;
  };

  const handleDateAdded = (date, level) => {
    if (!dateLevelsMap[date]) {
      setDateLevelsMap((prevMap) => ({
        ...prevMap,
        [date]: level,
      }));
    }
  };


  return (
    <ChakraProvider>
      <div className="flex items-center justify-center mt-2 mb-2">
        <h1 className='text-3xl text-blue-500'>LifeScribe - Alpha <span className='font-semibold'>v1</span></h1>
      </div>
      <div className="p-5">
        <Tree  label={<div className='StyledNode'>Start</div>}>
          {renderTree(data)}
        </Tree>
      </div>
    </ChakraProvider>
  );
}

export default App
