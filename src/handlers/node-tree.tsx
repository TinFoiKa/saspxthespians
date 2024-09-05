

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

    static converted(array: string[]) {
        if (array == null || array.length == 0) {
            return undefined
        }

        return OwnNode.build(array, 0, array.length -1)
    }

    private static build(array: string[], lo: number, hi: number, parent?: OwnNode) {
        if (lo > hi)
        {
            return undefined;
        }
    
        const mid : number = lo + (hi - lo) / 2;
        const root = new OwnNode(array[mid]);

        if (parent != undefined)    root.setParent(parent) // parent tracking

        root.l = OwnNode.build(array, lo, mid - 1, root);
        root.r = OwnNode.build(array, mid + 1, hi, root);

        return root;
    }

}

export default OwnNode