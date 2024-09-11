import OwnNode from "./node-tree"
import Queue from "./queue-handle"

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
    commandQueue = new Queue<string>()

    constructor(logic: string, location?: string) { // in terms of logic, ({prop} {quality}) {GATE} ({prop} {quality}) BINARY TREE
        super(location);
        this.logic = logic
    }

    // translation of logic to tree, then object
    requestObj() {
        // group objects into {[()]}
        const tree = new OwnNode("")
        tree.converted(this.logic)

        const node = tree ? tree.val : "0"

        if (node != "0") {
            return JSON.parse(this.hydrateGate("{", tree) + "}")
        } else {
            return "no object"
        }
        
    }

    FunctionNames = Object.freeze({
        group: "" 
    })

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
                    return this.hydrateItems(command, node) // the value would be "(props assignment)"
            }
        } else {
            return "erroneous input"
        }
    }

    private hydrateItems(command: string, node: OwnNode | undefined): string {
        if (node == undefined) {
            console.log("bad ending nodes")
            return ""
        }
        // deepest-layer items (props assignment)
        const trimmed = node.val.trim().substring(1, node.val.length - 2)
        let split : string[] = []
        const match = trimmed.match(/'.+'/g)
        if (match) {
            split = [match[0].substring(1, match[0].length-2), trimmed.substring(match[0].length, trimmed.length-1)]
        } else {
            split = trimmed.split(" ")
        }

        let string = command + "{property: " + split[0]

        const quality = split[1]
        switch (quality) { // catch a few special cases: Check - Greater than, less than - 
            case ("checked"):
                string += ", checkbox: { equals: true }"
                break;
            case ("notChecked"):
                string += ", checkbox: { equals: false }"
                break;
            default:  
                // comparison checks
                switch(quality.charAt(0)) {
                    case (">")
                }
        }

            return string
        return "erroneous value"
    }
    
}

class databaseWrite extends notionRequest {
    dir = "/pages/ca6302f3f51f4553b3ae0be8a9b83036"
}

export default [databaseQuery, notionRequest, databaseWrite]