
// eslint-disable-next-line @typescript-eslint/no-unused-vars


const types = {
    date: (start: string) => ({ "date" : {"start" : start,}}),
    title: (text: string) => ({ "title" : [{ "type" : "text", "text" : { "content" : text }}]}),
    select: (select: string) => ({ "select" : { "name" : select}}),
    text: (text: string) => ({"rich_text": [ { "text": { "content": text } } ] }),
    email: (email: string) => ({"email" : email})
}

const getType = {
    title: (text: string) => ({"title" : text})
}

const databases = [
    ["Points", "83a82d337da54e3bbc4f7254b84c4fd3"],
    ["Users", "b767e5f4b1b24a07b72684aae893453b"],
    ["Media", "ca6302f3f51f4553b3ae0be8a9b83036"],
    ["Reference", "4b878fc3319a44d2b0ed1fe6295e298d"]
]

export { types, getType, databases }
