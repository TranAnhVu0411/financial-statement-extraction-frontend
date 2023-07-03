import {v4 as uuidv4} from "uuid";

export const json2tree = (metadata) => {
    let textMetadata = metadata['text_metadata'];
    let tableMetadata = metadata['table_metadata'];
    let treeTextMetadata = [];
    let treeBBMetadata = [];
    for (let i = 0; i < textMetadata.length; i++) {
        let textChildren = [];
        let text_id = `text-${uuidv4()}`;
        for (let j = 0; j<textMetadata[i].length; j++) {
            let line_id = `line-${uuidv4()}`;
            let coordinate = textMetadata[i][j].line_coordinates;
            textChildren.push({
                text: textMetadata[i][j].text, 
                key: line_id, 
                type: 'line',
            });
            treeBBMetadata.push({
                x: coordinate[0], 
                y: coordinate[1], 
                width: coordinate[2], 
                height: coordinate[3],
                id: line_id,
                parent_id: text_id,
                type: 'line',
            })
        }
        treeTextMetadata.push({
            key: text_id,
            type: 'text',
            children: textChildren,
        })
    }

    for (let i = 0; i < tableMetadata.length; i++) {
        let id = `table-${uuidv4()}`;
        treeTextMetadata.push({
            key: id,
            type: 'table',
            // metadata: {tablename: tableMetadata[i].table_id, excelurl: tableMetadata[i].excel_url},
            metadata: tableMetadata[i].table_structure
        })
        let coordinate = tableMetadata[i].table_coordinate;
        treeBBMetadata.push({
            x: coordinate[0], 
            y: coordinate[1], 
            width: coordinate[2], 
            height: coordinate[3],
            id: id,
            parent_id: id,
            type: 'table',

        })
    }
    return {text: treeTextMetadata, bb: treeBBMetadata};
}