import { Graph, DefaultLink } from '@visx/network';
import { CustomeNode, Town } from '../../types/types';
import { NodeProvidedProps } from '@visx/network/lib/types';

interface Props {
    towns: Town[],
    roads: number[][],
    selectedTowns: Town[]
    handleTownClick: (id: number) => void;
}

export default function TownsMap({ towns, roads, selectedTowns, handleTownClick }: Props) {


    const nodes: CustomeNode[] = towns.map((town: Town) => {
        return { x: town.position.x, y: town.position.y, name: town.name, id: town.id, selected: selectedTowns.includes(town)}
    });


    const links = [];
    for (let i = 0; i < roads.length; i++) {
        for (let j = i; j < roads[i].length; j++) {
            if (roads[i][j] !== 0) {
                links.push({ source: nodes[i], target: nodes[j] })
            }
        }
    }
    const dataSample = {
        nodes,
        links: links,
    };

    const node = ({ node }: NodeProvidedProps<CustomeNode>) => (<>
        <text dominantBaseline='middle' textAnchor='middle' x={0} y={-20} fontWeight={'bold'}>{node.name}</text>
        <circle r={10} fill={node.selected ? 'red' : 'blue'} onClick={() => handleTownClick(node.id)}></circle>
        {node.selected && <circle r={12} fill='none' stroke='black'></circle>}
    
    </>);

    return (
        <div className='w-full min-h-full overflow-auto border-2 border-gray-500 flex-3/4 rounded-2xl'>
            <svg className='w-2xl h-120'>
                <Graph graph={dataSample} linkComponent={DefaultLink} nodeComponent={node} />
            </svg>
        </div>
    );

}
