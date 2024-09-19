
// eslint-disable-next-line @typescript-eslint/no-unused-vars


const types = {
    date: (start: string) => ({ "date" : {"start" : start,}}),
    title: (text: string) => ({ "title" : [{ "type" : "text", "text" : { "content" : text }}]}),
    select: (select: string) => ({ "select" : { "name" : select}}),
    text: (text: string) => ({"rich_text": [ { "text": { "content": text } } ] })
}

export { types }
