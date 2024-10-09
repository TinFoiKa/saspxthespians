import OwnNode from "./node-tree"
import { types } from "./notion-types"

const shortHands = [
    // type - checkbox  
    ["checked", ', "checkbox": {"equals": true }'],
    ["!checked", ', "checkbox": { "equals": false }'],
    // type - dates
    [">", ', "date": { "after": '],
    ["<", ', "date": { "before": '],
    // type - numbers
    ["<", ', "number": { "less_than": '],
    ["<=", ', "number": { "less_than_or_equal_to": '],
    [">=", ", number: {greater_than_or_equal_to: "],
    [">", ", number: { greater_than: "],
    ["=", ", number: { equals: "],
    // type - people - checks first names
    ["needs", ', "people": ']
]

class notionRequest {
    url = "https://sasthespians.aaronli69.workers.dev"
    location: string

    constructor (location: string ) { 
        this.location = location
    }
}

class databaseQuery extends notionRequest{
    dir = "/databases/"+ this.location + "/query"
    method = "POST"
    logic: string
    
    constructor(logic: string, location: string) { // in terms of logic, ({prop} {quality}) {GATE} ({prop} {quality}) BINARY TREE
        super(location);
        this.logic = logic
        console.log(this.dir)
    }

    async execute(): Promise<Response> {
        const body = this.requestObj()
        console.log(body)
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
    requestObj() {
        // group objects into {[()]}
        const tree = new OwnNode("")
        tree.converted(this.logic)

        const node = tree ? tree.val : "0"

        if (node != "0") {
            return this.hydrateGate('{"filter": {', tree) + "}"
        } else {
            return "no object"
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
                    return this.hydrateItems(command, node) // the value would be "(props assignment)"
            }
        } else {
            return "erroneous input"
        }
    }

    private hydrateItems(command: string, node: OwnNode | undefined): string {
        if (node == undefined || node.val == 'null') {
            console.log("bad ending nodes")
            return ""
        }
        // deepest-layer items (props assignment)
        const trimmed = node.val.trim().substring(1, node.val.length - 1) // cleans (), allows for space split.
        let split : string[] = []
        const match = trimmed.match(/'.+'/g)
        if (match) {
            split = [match[0].substring(1, match[0].length-2), trimmed.substring(match[0].length, trimmed.length-1)]
        } else {
            split = trimmed.split(" ")
        }

        let string = command + '"property": "' + split[0] + '"'

        const quality = split[1]

        //* dates, numbers (dates in 2001-9-11 format)
        if(quality.match(/^[<>=]+(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/g)) { // date | range 2 -3
            string += this.dateNumResult([2,3], quality)
        } else if (quality.match(/^[<>=]+(\d+)$/g)) { // number | range 4-8
            string += this.dateNumResult([4,8], quality)
        } else {
    
        //* checkbox
        switch(quality) {
            case ("checked"):
                string += shortHands[0][1]
                break;
            case ("!checked"):
                string += shortHands[1][1]
                break;
        }

        if (quality.match(/of_(\w)+/g)){
            const displace = 3
            const category = quality.substring(displace)
            string += ', "select": { "equals": "' + category + '"}' 
        }

        //* email matching
        if(quality.match(/^is_[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            const displace = 3
            const email = quality.substring(displace)
            string += ', "email": { "equals": "' + email + '"}'
        } else {

        //* text matching
        if(quality.match(/is_(\w)+/g)) {
            const displace = 3
            const text = quality.substring(displace)
            string += ', "rich_text": { "equals": "' + text + '"}'
        } else if (quality.match(/contains_(\w)+/g)) {
            const displace = 9
            const text = quality.substring(displace)
            string += ', "rich_text": { "contains": "' + text + '"}'
        }
        }

        //* tags matching
        if (quality.match(/has_tag_(\w)+/g) != null) { //! has_tag_ is 8 characters IMPORTANT
            const displace = 8
            const tag = quality.substring(displace)
            string += ', "contains": ' + tag 
        }
        
        }
        return string + "}"
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
    Property: object
}

class databaseWrite extends notionRequest {
    dir = "/pages"
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
        console.log(search.Property)
        const page = new databaseQuery("{" + search.Name + " is_" + search.Property.email + "}", this.location)
        const json = await (await (page.execute())).json()
        
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

    constructed(properties: propObject[]) {
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
