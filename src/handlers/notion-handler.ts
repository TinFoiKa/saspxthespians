/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import OwnNode from "./node-tree"
import { types, databases } from "./notion-types"

const shortHands = ["sel", "chk", "txt"]
const dateRegex = /^([<>]=?)?(\d{4}\/\d{2}\/\d{2})$/
const numberRegex = /^([<>]=?)?\d+$/
const emailRegex = /^email:(.+@.+\..+)$/

class notionRequest {
    url = "https://sasthespians.aaronli69.workers.dev"
    location: string

    constructor (location: string ) { 
        this.location = "error"
        for(let i = 0; i < databases.length; i++) {
            if (databases[i][0] == location) {
                this.location = databases[i][1]
            }
        }
    }
}

class databaseQuery extends notionRequest{
    dir = "/notion/databases/"+ this.location + "/query"
    method = "POST"
    logic: string
    
    constructor(logic: string, location: string) { // in terms of logic, ({prop} {quality}) {GATE} ({prop} {quality}) BINARY TREE
        super(location);
        this.logic = logic
        // console.log(this.dir)
    }

    async execute(): Promise<Response> {
        const body = this.requestObj()
        // console.log("Final request body:", body)
        const response = await fetch(this.url + this.dir, {
            method: this.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        } )
        return response
    }

    // translation of logic to tree, then object
    private requestObj() {
        console.log("Starting requestObj with logic:", this.logic);
        
        // group objects into {[()]}
        const tree = new OwnNode("")
        tree.converted(this.logic)
        
        console.log("Tree after conversion:", tree);
        
        const node = tree ? tree.val : "0"
        console.log("Node value:", node);

        if (node != "0") {
            const result = this.hydrateGate('{"filter": {', tree) + "}}";
            console.log("Final result:", result);
            return result;
        } else {
            console.log("No object created - node was 0");
            return "no object"
        }
    }



    private hydrateGate(command: string, node: OwnNode | undefined, level: number = 0): string {
        if (node != undefined) {
            /*console.log("\n=== HYDRATE GATE ===");
            console.log("Input node at level", level, ":", {
                value: node.val,
                command: command,
                hasLeft: !!node.l,
                hasRight: !!node.r
            });*/

            switch (node.val) {
                case ("OR"):
                    // For nested OR operations, wrap in an object
                    const orCommand = level > 0 ? '{"or": [' : '"or": [';
                    const orParts = []
                    if (node.l) orParts.push(this.hydrateGate("", node.l, level + 1));
                    if (node.r) orParts.push(this.hydrateGate("", node.r, level + 1));
                    const orResult = command + orCommand + orParts.join(',') + "]" + (level > 0 ? "}" : "");
                    //console.log("OR result at level", level, ":", orResult);
                    return orResult;

                case ("AND"):
                    // For nested AND operations, wrap in an object
                    const andCommand = level > 0 ? '{"and": [' : '"and": [';
                    const andParts = []
                    if (node.l) andParts.push(this.hydrateGate("", node.l, level + 1));
                    if (node.r) andParts.push(this.hydrateGate("", node.r, level + 1));
                    const andResult = command + andCommand + andParts.filter(part => part !== "").join(',') + "]" + (level > 0 ? "}" : "");
                    // console.log("AND result at level", level, ":", andResult);
                    return andResult;

                default:
                    // console.log("Processing leaf node at level", level, ":", node.val);
                    let value = node.val.trim();
                    if ((value.startsWith('[') && value.endsWith(']')) ||
                        (value.startsWith('{') && value.endsWith('}')) ||
                        (value.startsWith('(') && value.endsWith(')'))) {
                        // console.log("Found wrapped expression, unwrapping:", value);
                        value = value.slice(1, -1).trim();
                        return this.hydrateGate(command, new OwnNode(value), level);
                    }
                    
                    if (value.includes(' OR ') || value.includes(' AND ')) {
                        // console.log("Found nested operation in:", value);
                        return this.hydrateGate(command, new OwnNode(value), level);
                    }
                    
                    return this.hydrateItems(command, node);
            }
        } else {
            console.log("undefined node at level", level);
            return "erroneous input";
        }
    }

    private hydrateItems(command: string, node: OwnNode | undefined): string {
        console.log("\n=== HYDRATE ITEMS ===");
        console.log("Input:", {
            nodeValue: node?.val,
            command: command
        });

        if (node == undefined || node.val == 'null') {
            // console.log("bad ending nodes");
            return "";
        }

        // Remove ALL types of brackets and trim
        let value = node.val.trim();
        let originalValue = value;
        
        // First, check if we have a nested OR/AND before removing brackets
        if (value.includes(' OR ') || value.includes(' AND ')) {
            console.log("Found nested operation before unwrapping:", value);
            return this.hydrateGate(command, new OwnNode(value));
        }
        
        // Then handle bracket removal
        while ((value.startsWith('[') && value.endsWith(']')) ||
               (value.startsWith('{') && value.endsWith('}')) ||
               (value.startsWith('(') && value.endsWith(')'))) {
            value = value.slice(1, -1).trim();
            // console.log("Unwrapped from:", originalValue, "to:", value);
            originalValue = value;
        }

        // Split on first space only
        const firstSpaceIndex = value.indexOf(' ');
        if (firstSpaceIndex === -1) {
            // console.log("No space found in:", value);
            return command + '"property": "' + value + '"';
        }

        const property = value.slice(0, firstSpaceIndex).trim();
        const quality = value.slice(firstSpaceIndex + 1).trim();
        //console.log("Split into:", { property, quality });

        let string = command + '"property": "' + property + '"';
        
        // Handle different data types with more logging
        if (quality.startsWith("sel:")) {
            // console.log("Processing select:", quality);
            string += ', "select": { "equals": "' + quality.substring(4) + '"}'
        } else if (quality.startsWith("chk:")) {
            // console.log("Processing checkbox:", quality);
            string += ', "checkbox": { "equals": ' + quality.substring(4).toLowerCase() + '}'
        } else if (quality.startsWith("txt:")) {
            // console.log("Processing text:", quality);
            string += ', "rich_text": { "equals": "' + quality.substring(4) + '"}'
        } else if (emailRegex.test(quality)) {
            const email = quality.match(emailRegex)![1]
            string += ', "email": { "equals": "' + email + '"}'
        } else if (dateRegex.test(quality)) {
            const [_, operator = "=", date] = quality.match(dateRegex) || []
            const comparator = operator === "=" ? "equals" : 
                              operator === ">" ? "greater_than" :
                              operator === ">=" ? "greater_than_or_equal_to" :
                              operator === "<" ? "less_than" :
                              operator === "<=" ? "less_than_or_equal_to" : "equals"
            string += ', "date": { "' + comparator + '": "' + date + '"}'
        } else if (numberRegex.test(quality)) {
            const [_, operator = "=", num] = quality.match(numberRegex) || []
            const comparator = operator === "=" ? "equals" : 
                              operator === ">" ? "greater_than" :
                              operator === ">=" ? "greater_than_or_equal_to" :
                              operator === "<" ? "less_than" :
                              operator === "<=" ? "less_than_or_equal_to" : "equals"
            string += ', "number": { "' + comparator + '": ' + num + '}'
        } else {
            // console.log("Defaulting to rich_text:", quality);
            string += ', "rich_text": { "equals": "' + quality + '"}'
        }

        console.log("Final string:", string);
        return command ? string : '{' + string + '}';
    }

    private dateNumResult(range: number[], quality: string){
        // populate with the preset things
        const ineq = quality.match(/[<>=]{2}/g) ? quality.substring(0,1) : quality.charAt(0)

        for(let i = range[0]; i <= range[1]; i++) {
            if (shortHands[i][0] == ineq) {
                return shortHands[i][1] + parseInt(quality.substring(ineq.length, quality.length-1)) + "}"        // add the correspondent shorthand to string.
            }
        }
    }
}

interface propObject {
    Name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Property: any
}

class databaseWrite extends notionRequest {
    dir = "/notion/pages"
    method = "POST"
    pageObjectArray: propObject[]

    // is a pair when editing row, however a normal array when entering values.
    constructor(objectString: propObject[], database: string) {
        super(database)
        this.pageObjectArray = objectString
    }

    async editRow() : Promise<Response> {
        this.method = "POST"
        const search = this.pageObjectArray[0]
        const property = this.pageObjectArray[1]
        
        const query = new databaseQuery("{" + search.Name + " email:" + search.Property.email + "}", this.location)
        const json = await (await (query.execute())).json()
        
        const id = json ? json.results[0].id : ""

        console.log(id)

        // catch empty response
        if (id != "" && id != undefined) {
            const body = {"properties": {
                [property.Name] : property.Property
            }}

            const response = await fetch(this.url + this.dir + "/" + id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            return response
        } else {
            return new Response("no response")
        }
    }

    async execute() {
        const body = {"parent": {"database_id": this.location}, ...this.constructed(this.pageObjectArray)}
        console.log(body)
        const response = await fetch(this.url + this.dir, {
            method: this.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        } )
        return response
    }

    private constructed(properties: propObject[]) {
        //* properties are of the form [{Name: string, Property: string}]
        const props = Object.assign({}, ...properties.map((prop) => {
            return {[prop.Name]: prop.Property}
        }))

        const res = {
            "properties" : props
        }

        console.log(res)
        return res
    }
}

export { databaseQuery, databaseWrite, types }
