import {useState, useEffect} from 'react'
import { TreeNode } from 'react-organizational-chart';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input
} from '@chakra-ui/react'
import { conditionalExpression } from '@babel/types';

export default function Node({node, data, setData, displayedDates, setDisplayedDates, level, onDateAdded, dateLevelsMap}){



  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newNodeText, setNewNodeText] = useState('');
  const [canAddChild, setCanAddChild] = useState(true);
  const [canAddResult, setCanAddResult] = useState(true);

  //const addChildNode = () => {
    //node.children.push({text: newNodeText, children: []});
    //setData({...data})
  //}

  const addChildNode = () => {
    const currentDate = new Date().toLocaleDateString();
    const randomDate = generateRandomDate(new Date(2022, 0, 1), new Date());
  
    // Check if the current date or randomDate is not in displayedDates
    if (!displayedDates.includes(currentDate) || !displayedDates.includes(randomDate.toLocaleDateString())) {
      const newNode = { text: newNodeText, children: [], date: randomDate };
      node.children.push(newNode);
      
      // Update displayedDates with the new date
      const updatedDates = [...displayedDates];
      if (!updatedDates.includes(randomDate.toLocaleDateString())) {
        updatedDates.push(randomDate.toLocaleDateString());
      }
      setDisplayedDates(updatedDates);
  
      onDateAdded(randomDate.toLocaleDateString(), level); // Pass the level here
  
      setData({ ...data });
    } else {
      node.children.push({ text: newNodeText, children: [], date: randomDate });
      setData({ ...data });
    }
  };

  function generateRandomDate(from, to) {
    return new Date(
      from.getTime() +
        Math.random() * (to.getTime() - from.getTime()),
    );
  }

  const addResultNode = () => {
    node.children.push({text: newNodeText, children: [], result: true, date: generateRandomDate(new Date(2022, 0, 1), new Date())});
    setData({...data})
  }

  const editNode = () => {
    node.text = newNodeText;
    setData({...data})
  }

  const removeNode = () => {
    const parentNode = findParentNode(data, node);
    if (parentNode) {
      parentNode.children = parentNode.children.filter((child) => child !== node);
      setData({ ...data });
    }
  };

  // Helper function to find the parent node
  const findParentNode = (currentNode, targetNode) => {
    if (currentNode.children.includes(targetNode)) {
      return currentNode;
    }
    for (const child of currentNode.children) {
      const parent = findParentNode(child, targetNode);
      if (parent) {
        return parent;
      }
    }
    return null;
  };

  useEffect(() => {
    node.children.length > 0 ? setCanAddResult(false) : setCanAddResult(true);
    let resCount = 0;
    node.children.map((child) => {
      child.result === true ? resCount++ : null;
    })

    resCount > 0 ? setCanAddChild(false) : setCanAddChild(true);
  }, [data])
  


  return(
    
    
    <div className='pointer' onClick={onOpen}>
    {level === 0 && node.date ? (
      <div className="date-title">
        {new Date(node.date).toLocaleDateString()}
      </div>
    ) : null}

    <TreeNode
    label={
      <div
        className={`pointer  font-semibold ${
          node.result !== true ? `StyledNode hover:bg-purple-700` : `ResultNode hover:bg-green-700`
        }`}
        onClick={onOpen}
      >
        {node.text}
      </div>
    }
  >
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className='border-2-white'>
          <ModalHeader>Node Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col justify-center items-center gap-4">
              {canAddChild ? <div className="">
                <h1 className='mb-2'>Add A <span className='text-blue-500 font-semibold'>Choice</span> Node</h1>
                <Input onChange={(e) => setNewNodeText(e.target.value)} placeholder='Node Text' />
                <Button onClick={() => addChildNode()} className='mt-2' colorScheme='blue'>Add Choice</Button>
              </div> : null}

              {canAddResult ?<div className="mt-2">
                <h1 className='mb-2'>Add A <span className='text-green-500 font-semibold'>Result</span> Node</h1>
                <Input onChange={(e) => setNewNodeText(e.target.value)} placeholder='Node Text' />
                <Button onClick={() => addResultNode()} className='mt-2' colorScheme='green'>Add Result</Button>
              </div>: null}

              <div className="mt-2">
                <h1 className='mb-2'>Edit Node</h1>
                <Input onChange={(e) => setNewNodeText(e.target.value)} placeholder='Edit Node Text' />
                <Button onClick={() => editNode()} className='mt-2' colorScheme='red'>Edit Node</Button>
              </div>

              <div className="">
                <Button className='mt-2' onClick={() => removeNode()} colorScheme='orange'>Remove Node(s)!</Button>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </TreeNode>
      </div>
  )
}