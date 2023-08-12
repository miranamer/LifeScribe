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

export default function Node({node, data, setData}){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newNodeText, setNewNodeText] = useState('');
  const [canAddChild, setCanAddChild] = useState(true);
  const [canAddResult, setCanAddResult] = useState(true);

  const addChildNode = () => {
    node.children.push({text: newNodeText, children: []});
    setData({...data})
  }

  const addResultNode = () => {
    node.children.push({text: newNodeText, children: [], result: true});
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
    
    
    <TreeNode
    label={
      <div
        className={`pointer hover:bg-gray-300 ${
          node.result !== true ? `StyledNode` : `ResultNode`
        }`}
        onClick={onOpen}
      >
        {node.text}
      </div>
    }
  >
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
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
      
  )
}