import { Tree, TreeNode } from 'react-organizational-chart';
import { useState, useEffect } from "react";
import Node from './Node'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react';

function App() {

  const [trees, setTrees] = useState([{x: screen.width / 2 - 165,
    y: 80,
    root:{
     text: '',
     children: [
       { text: 'make a car', children: [], date: Date.now() },
       { text: 'make a book', children: [], date: Date.now() }
     ],
     //date: Date.now()
   }}]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control') {
        const handleMouseUp = (event) => {
          // Get the click position relative to the viewport
          const x = event.clientX;
          const y = event.clientY;

          // Create a new tree with a root node at the click position
          const newTree = {
            x: x - 21,
            y: y + 10,
            root: {
              text: '',
              children: [],
              //date: Date.now(),
            },
          };

          // Add the new tree to the array of trees
          setTrees((prevTrees) => [...prevTrees, newTree]);

          // Remove the mouseup event listener
          window.removeEventListener('mouseup', handleMouseUp);
        };

        // Attach the mouseup event listener
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        // Remove the mouseup event listener if Ctrl is released
        window.removeEventListener('mouseup', handleMouseUp);
      }
    };

    // Attach the keydown and keyup event listeners to the window
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up the event listeners on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const [startNodePosition, setStartNodePosition] = useState({ x: 100, y: 100 });
  const [draggedTreeIndex, setDraggedTreeIndex] = useState(null); // Add this state

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, index) => {
    setIsDragging(true);
    setDraggedTreeIndex(index);

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
  };

  const snapThreshold = 20; // Adjust this value as needed

  const handleMouseMove = (e) => {
    if (!isDragging || draggedTreeIndex === null) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    let closestY = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    trees.forEach((tree, treeIndex) => {
      const startNodeY = tree.y;
      const choiceNodeYPositions = [];

      // Calculate y-positions of all nodes, including nested children
      const flattenNodes = (node) => {
        choiceNodeYPositions.push(node.y);
        node.children.forEach(flattenNodes);
      };
      flattenNodes(tree.root);

      [startNodeY, ...choiceNodeYPositions].forEach((y) => {
        const distance = Math.abs(y - newY);
        if (distance < closestDistance && distance <= snapThreshold) {
          closestDistance = distance;
          closestY = y;
        }
      });
    });

    const snappedY = closestY !== null ? closestY : newY;

    setTrees((prevTrees) =>
      prevTrees.map((tree, index) =>
        index === draggedTreeIndex ? { ...tree, x: newX, y: snappedY } : tree
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedTreeIndex(null);
  };



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
  const dateTitle = renderDateTitle(node, level); // Pass the level parameter

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
      const yPosition = level === 0 ? -20 : 0; // Adjust the vertical position
      
      return (
        <div
          className={`date-title level-${dateLevel}`}
          style={{
            left: `${level - 40}px`, // Adjust the left position based on the level and add 10px horizontal offset
            top: `${yPosition}px`, // Apply the vertical position
          }}
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
      <div className="h-full w-full bg-black text-white">
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
        }}
      >
        <div className="flex items-center justify-center">
          <h1 className='text-3xl mt-3'>LifeScribe - v2 Beta</h1>
        </div>
        {trees.map((tree, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${tree.y}px`,
              left: `${tree.x}px`,
              cursor: isDragging && index === draggedTreeIndex ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
          >
            <Tree lineWidth='2px' lineColor='white' nodePadding='30px' label={<div className="StyledNode">Start</div>}>
              {renderTree(tree.root)}
            </Tree>
          </div>
        ))}
      </div>
      </div>
    </ChakraProvider>
  );
}

export default App
