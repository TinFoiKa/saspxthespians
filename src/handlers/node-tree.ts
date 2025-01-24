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

    converted(string: string): OwnNode {
        console.log("Converting string:", string);
        
        // First pass to create the initial node
        this.group(string, 0, this);
        
        // Now recursively process any nested expressions
        this.processNestedExpressions(this);
        
        return this;
    }

    private processNestedExpressions(node: OwnNode): void {
        console.log("\nProcessing node:", {
            value: node.val,
            hasLeft: !!node.l,
            hasRight: !!node.r
        });
        
        // First check for OR operations at any level
        if (node.val.includes(' OR ')) {
            const nestedMatch = this.findTopLevelOperator(node.val);
            if (nestedMatch && nestedMatch.operator === 'OR') {
                const { operator, parts } = nestedMatch;
                node.val = operator;
                node.l = new OwnNode("");
                node.r = new OwnNode("");
                
                this.group(parts[0], 0, node.l);
                this.group(parts[1], 0, node.r);
                
                this.processNestedExpressions(node.l);
                this.processNestedExpressions(node.r);
                return;
            }
        }
        
        // handle AND operations + brackets
        let currentValue = node.val;
        while ((currentValue.startsWith('[') && currentValue.endsWith(']')) ||
               (currentValue.startsWith('(') && currentValue.endsWith(')'))) {
            currentValue = currentValue.slice(1, -1).trim();
            
            const nestedMatch = this.findTopLevelOperator(currentValue);
            if (nestedMatch) {
                const { operator, parts } = nestedMatch;
                node.val = operator;
                node.l = new OwnNode("");
                node.r = new OwnNode("");
                
                this.group(parts[0], 0, node.l);
                this.group(parts[1], 0, node.r);
                
                this.processNestedExpressions(node.l);
                this.processNestedExpressions(node.r);
                return;
            }
        }
    }

    // given tree string is an unbalanced array - cannot do simple binary tree calculations'
    private group(string: string, level: number, node: OwnNode) : void {
        console.log(`Processing group at level ${level}:`, string);
        
        if (level > 2) {
            node.val = string;
            console.log("Max level reached; setting value:", string);
            return;
        }

        string = string.trim();

        const nestedMatch = this.findTopLevelOperator(string);
        if (nestedMatch) {
            const { operator, parts } = nestedMatch;
            
            node.val = operator;
            node.l = new OwnNode("");
            node.r = new OwnNode("");
            
            console.log(`${operator} node created with parts:`, parts);
            
            this.group(parts[0], level + 1, node.l);
            this.group(parts[1], level + 1, node.r);
            return;
        }

        // Handle expressions with different bracket types
        const reg : RegExp[] = [/\{.+\}/g, /\[.+\]/g, /\(.+\)/g];
        
        if (level === 0 && string.startsWith('{') && string.endsWith('}')) {
            node.val = string;
            console.log("Level 0 handling:", string);
            return;
        }
        
        const roots : RegExpMatchArray = string.match(reg[level]) || ["null"];
        if (roots[0] !== "null") {
            node.val = roots[0];
            console.log(`Found match at level ${level}:`, roots[0]);
        } else {
            const newVal = level === 0 ? `{${string}}` : 
                          level === 1 ? `[${string}]` : 
                          level === 2 ? `(${string})` : string;
            node.val = newVal;
            console.log(`No match at level ${level}, created:`, newVal);
        }
    }

    // find operators between brackets
    private findTopLevelOperator(str: string): { operator: string, parts: string[] } | null {
        console.log("\nFinding operator in:", str);
        
        // remove outer brackets
        let processedStr = str.trim();
        if ((processedStr.startsWith('{') && processedStr.endsWith('}')) ||
            (processedStr.startsWith('[') && processedStr.endsWith(']')) ||
            (processedStr.startsWith('(') && processedStr.endsWith(')'))) {
            processedStr = processedStr.slice(1, -1).trim();
            console.log("After bracket removal:", processedStr);
        }
        
        let depth = 0;
        const bracketStack = [];
        let currentPart = '';
        
        for (let i = 0; i < processedStr.length; i++) {
            const char = processedStr[i];
            
            if (char === '{' || char === '[' || char === '(') {
                bracketStack.push(char);
                depth++;
                //console.log(`Depth increased to ${depth} at char ${char}`);
            } else if (char === '}' || char === ']' || char === ')') {
                bracketStack.pop();
                depth--;
                //console.log(`Depth decreased to ${depth} at char ${char}`);
            }
            
            if (depth === 0) {
                if (processedStr.substring(i).match(/^(\s+)(OR|AND)(\s+)/)) {
                    const match = processedStr.substring(i).match(/^(\s+)(OR|AND)(\s+)/);
                    if (match) {
                        const operator = match[2];
                        const parts = [
                            currentPart.trim(),
                            processedStr.substring(i + match[0].length).trim()
                        ];
                        //console.log("Found operator:", operator);
                        //console.log("Parts:", parts);
                        return { operator, parts };
                    }
                }
            }
            
            if (depth >= 0) {
                currentPart += char;
            }
        }
        
        console.log("No top-level operator found");
        return null;
    }
}


export default OwnNode