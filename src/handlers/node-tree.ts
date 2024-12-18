

class OwnNode {
    val: string
    parent: OwnNode | undefined
    l: OwnNode | undefined
    r: OwnNode | undefined

    constructor (val: string) {
        this.val = val
    }

    setParent(node: OwnNode){
        this.parent = node
    }

    converted(string: string) : OwnNode {
        this.group(string, 0, this)
        return this
    }

    // given tree string is an unbalanced array - cannot do simple binary tree calculations'
    private group(string: string, level: number, node: OwnNode) : void {
        // final case - level is greater than the () level. Only 3 layers of logic are allowed. Any more is ridiculous.
        if (level > 2) {
            node.val = string
            console.log("")
            return
        }

        // const leftSubstring = string.match(/\{.+\} ([A-Z]{2}|[A-Z]{3}) \{.+\}/g)
        const reg : RegExp[] = [/\{.+\}/g, /\[.+\]/g, /\(.+\)/g]
        const roots : RegExpMatchArray = string.match(reg[level]) || ["null"] // this system will use 3 layers, checking from up to down/in to out. {[()]}]

        // defining operation, left and right logic
        const firstExp = roots[0].length
        const left = roots[0]

        if(roots.length > 1) { // in case of middle operation,
            const right = roots[1]
            const oper = string.substring(firstExp, firstExp + 2).trimEnd()
            // populate node tree
            node.val = oper   
            node.l = new OwnNode("")
            node.r = new OwnNode("")
            this.group(left, level + 1, node.l) // both exit recursion.
            this.group(right, level + 1, node.r) 
        } else {
            node.val = left // catch case that original expression is the lowest level of logic.
        }
        
    }
}

export default OwnNode