import { Tree, TreeNode } from 'react-organizational-chart';
import { useState } from "react";
import Node from './Node'
import { ChakraProvider } from '@chakra-ui/react'

function App() {




  const [data, setData] = useState({
    text: '',
    children: [
      { text: 'make a game', children: [] },
      { text: 'make a book', children: [] }
    ]
  });

  const renderTree = (node) => (
    <TreeNode label={<Node node={node} data={data} setData={setData} />}>
      {node.children.map((child, index) => (
        <>{renderTree(child)}</>
      ))}
    </TreeNode>
  );

  return (
    <ChakraProvider>
      <div className="p-5">
        <Tree  label={<div className='StyledNode'>Start</div>}>
          {renderTree(data)}
        </Tree>
      </div>
    </ChakraProvider>
  );
}

export default App
