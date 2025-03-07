import { Graph, DefaultLink } from '@visx/network';
import { CustomeNode, Town } from '../../types/types';
import { NodeProvidedProps } from '@visx/network/lib/types';

interface Props {
    towns: Town[],
    roads: number[][],
    handleTownClick: (id: number) => void;
}

export default function TownsMap({ towns, roads, handleTownClick }: Props) {


    const nodes: CustomeNode[] = towns.map((town: Town) => {
        return { x: town.position.x, y: town.position.y, name: town.name, id: town.id }
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
        <text x={-10} y={-10}>{node.name}</text>
        <circle r={10} fill="blue" onClick={() => handleTownClick(node.id)}></circle>
    </>);

    return (
        <div className='border-2 rounded-2xl border-gray-500 flex flex-3/4'>
            <svg className='w-full h-full'>
                <Graph graph={dataSample} linkComponent={DefaultLink} nodeComponent={node} />
            </svg>
        </div>
    );

}
