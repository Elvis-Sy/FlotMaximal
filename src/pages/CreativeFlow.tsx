import { useState } from 'react';
import ReactFlowComponent from '../components/ReactFlowComponent';
import FieldCard from '../components/FieldCard';
import EdgeModifier from '../components/EdgeModifier';
import ContentWrapper from '../components/ContentWrapper';

const CreativeFlow = () => {
    const [fieldValue, setFieldValue] = useState<number>(0);
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);
  
    const updateEdgeLabel = (id: string, newLabel: number) => {
      setEdges(edges => edges.map(edge => 
        edge.id === id ? { ...edge, label: newLabel } : edge
      ));
    };
  
    return (
      <ContentWrapper>
        <div className="min-h-screen bg-[#fefefe] flex flex-col">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h1 className='text-2xl text-gray-800 py-4 pl-1 font-bold underline font-transcity tracking-wider'>Mode Libre</h1>
              <FieldCard onValueChange={setFieldValue} nodes={nodes} />
            </div>
          </div>
          
          <div className="flex-1 p-4 mt-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-300px)] md:h-[600px]">
              <ReactFlowComponent 
                fieldValue={fieldValue} 
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
              />
            </div>
          </div>
    
          <div className="bg-white border-t border-gray-200 mt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <EdgeModifier
                edges={edges}
                nodes={nodes}
                updateEdgeLabel={updateEdgeLabel}
              />
            </div>
          </div>
        </div>
      </ContentWrapper>
    );
}

export default CreativeFlow