import React, { lazy, useState } from "react"
import Loading from "../components/Loading.js"
console.log("entered control")
import "./Surfaces.css"

//! we should probably delete "user id" property

const Panel = lazy(() => import("../components/Panel.js"))

const Control = () => {
    
    const [matrix, setMatrix] = useState({array: []})
    const [insertType, setInsertType] = useState({})

    /*useEffect(() => { 
        const handleLoad = async () => {
            console.log("table loading...")
            const request = await axios.get(SERVER + "/api/getUsersTable")
            
            const table = request.data.res
            console.log(table)
            
            console.log("prepared")
            setMatrix({array: table, isFetching: false})
            console.log(matrix.isFetching)
        }
            
        handleLoad()
    }, [])*/

    // handling constituent partitions.
    const partition = (array: [{part: any, index: number}], low: number, high: number) => {
        const pivot = array[high].part
        // if partition on right, is position of previous pivot. if on left, inconsequential (? It works in my head)
        let i = low - 1 

        // traverse and swap.
        for (let j = low; j < high; j++) {
            if (array[j].part < pivot) {
                i++   // means that i now needs to be considered

                // woo swappage
                const temp = array[i]
                array[i] = array[j]
                array[j] = temp
            }
        }

        const temp = array[i + 1] // oh if only I had my precious pointers...
        array[i + 1] = array[high]
        array[high] = temp

        // returns position as int
        return i + 1
    } 

    // recursive sorting algorithm
    const quickSort = (array: [{part: any, index: number}], low: number, high: number) => {
        console.log("hello")
        if (low < high) { // break case is if low == high, meaning the sort is resolved
            // getting the index of the pivot
            const partitionIndex = partition(array, low, high)

            // recursion!!!!
            // will go as a {{{{}}}}
            quickSort(array, low, partitionIndex - 1)
            quickSort(array, partitionIndex + 1, high)
        }
    }

    // accepts "aspect" as a string corresponding to a property of the object in the array
    const matrixSort = (aspect: string, reversed: boolean) => {
        // encode into objects with parameters of data and OG index. 
        // will rearrange with a new array of indices produced in quicksort
        const prev = matrix.array
        console.log(prev[0][aspect])

        // populate this array
        // eslint-disable-next-line prefer-const
        let array = [{part: 0, index: 0}]
        const length = array.length

        for (let i = 0; i < length; i++) {
            const encoded = prev[i][aspect] // because strings can have direct comparisons, in javascript, I am spared from doing anything with Unicode
            console.log(encoded)
            array[i] = {part: encoded, index: i} // encapsulation
        }
        console.log(array)
        quickSort(array, 0, array.length-1)
        // repopulate array with matrix's information   

        console.log("bip", array)
        for (let i = 0; i <= array.length - 1; i++) {
            let direction
            if (reversed)       direction = array.length - 1 - i
            else                direction = i
            array[direction] = matrix.array[array[i].index]
        }

        // some conditions require 
        
        console.log("bip", array)

        setMatrix({array: array, isFetching: false})
    }

    const upAndDown = (e) => {
        if (e.target.value == "v") {
            e.target.value = "^"
            matrixSort(e.target.id, true)
        }
    }
 

   /* const callback = (eventData) => {
        setInsertType(eventData)
    }*/

    console.log("kms", matrix)

    return (
        <>
            <div hidden id = "" className = "overlay">
                <Panel />
            </div>
            {//<input type = "button" onClick = {(event) => dbInsert(insertType)} value = "Input "/>
            }
            <table className = "table" border = {1}>
                <thead className = "headers">
                    <tr> 
                        <th>Name <input type="button" id = "name" onClick={(event) => matrixSort(event.target.id, false)}/></th>
                        <th>User ID <input type="button" id = "userID" onClick={(event) => matrixSort(event.target.id, false)}/></th>
                        <th>Email <input type="button" id = "email" onClick={(event) => matrixSort(event.target.id, false)}/></th>
                        <th>Member Type <input type="button" id = "membertype" onClick={(event) => matrixSort(event.target.id, false)}/></th>
                        <th>Total Points <input type="button" id = "totalpoints" onClick={(event) => upAndDown(event)}/></th>
                    </tr>
                </thead>
                <tbody>
                    {matrix.isFetching == null ? <Loading /> : matrix.array.map((object, i) => {
                        console.log("should be going?");
                        return(
                            <React.Fragment key = {i}>
                                <tr>
                                    <td>{object.name }</td>
                                    <td>{object.userID}</td>
                                    <td>{object.email}</td>
                                    <td>{object.membertype}</td>
                                    <td>{object.totalpoints}</td>
                                </tr>
                            </React.Fragment>
                        )
                        
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Control