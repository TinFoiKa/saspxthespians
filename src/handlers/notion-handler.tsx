import OwnNode from "./node-tree"
import Stack from "./stack-handle"

class notionRequest {
    url = "https://sasthespians.aaronli69.workers.dev"
    location: string | undefined = "ca6302f3f51f4553b3ae0be8a9b83036"

    constructor (location?: string ) { 
        this.location = location
    }
}

class databaseQuery extends notionRequest{
    dir = "/databases/"+ this.location + "/query"
    method = "POST"
    logic: string
    commandstack = new Stack<string>()

    constructor(logic: string, location?: string) { // in terms of logic, ({prop} {quality}) {GATE} ({prop} {quality}) BINARY TREE
        super(location);
        this.logic = logic
    }

    // translation of logic to tree, then object
    requestObj() {
        // group objects into parenthesis groups
        let string = this.logic
        
        

        const finalCommand = "{"; // JSON string to be parsed

        const stringArray: string[] = this.logic.split(" ")
        const tree = OwnNode.converted(stringArray) || undefined

        const node = tree != undefined ? tree.val : "0"

        if (node != "0") {
            return JSON.parse(this.hydrateGate(finalCommand, tree))
        } else {
            return "no object"
        }
        
    }

    FunctionNames = Object.freeze({
        group: "" 
    })

    private group(string: string) : string[] {
        if(string.charAt(0).match("[(]")){
            // open loop to find next group, split string at the ending index
            let index = 0
            for (index = 0; index <= string.length; index++){
                if (string.charAt(index).match("[)]")){
                    
                }
            }
            return [string.substring(1, index)]
        }
    }

    private hydrateGate(command: string, node: OwnNode | undefined): string{
        if (node != undefined) {
            switch (node.val) { // this is for the first layer of gate
                case ("OR"):
                    command += "or: ["
                    return this.hydrateGate(command, node.l) + this.hydrateGate(command, node.r) + "]" // recurse if gate
                case ("AND"):
                    command += "and: ["
                    return this.hydrateGate(command, node.l) + this.hydrateGate(command, node.r) + "]"
                default: // not a gate; because of tree structure, props and values are at the bottom
                    return this.hydrateItems(command, node) + this.hydrateItems(command, node)
            }
        } else {
            return "erroneous input"
        }
    }

    private hydrateItems(command: string, node: OwnNode | undefined): string {
        // deepest-layer items (node is left, but you also have the sibling)
        if (node && node.parent && node.parent.r) {
            let string = command + "{property:" + node // populate "property"

            const quality = node.parent.r.val
            switch (quality) { // catch a few special cases
                case ("checked"):
                    string += ", checkbox: { equals: true }"
                    break;
                default: 
                    if (quality.includes(">")) // next do greater than, less than checking   
            }

            return string
        }
        return "erroneous value"
    }
    
}

class databaseWrite extends notionRequest {
    dir = "/pages/ca6302f3f51f4553b3ae0be8a9b83036"
}

export default [databaseQuery, notionRequest, databaseWrite]