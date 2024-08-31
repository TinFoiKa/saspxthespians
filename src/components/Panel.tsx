

const Panel = () => {
    let type = false // single, 0 is matrix

    return (
        <>
            <div className="selectionpanel">
                {type 
                    ? 
                    <>
                    <input type = "text" />
                    <select name = "member type" id = "membertype">
                        <option value = "0">Apprentice</option>
                        <option value = "0">Member</option>
                        <option value = "1">Officer</option>
                    </select>
                    </>
                
                    : // else
            
                    <table border = {3}>
                        <thead>
                            <tr>Name</tr>
                            <tr>Email</tr>
                            <tr>Member Type</tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td contentEditable='true'></td>
                            <td contentEditable='true'></td>
                        </tr>
                        <tr>
                            <td contentEditable='true'></td>
                            <td contentEditable='true'></td>
                            
                        </tr>
                        </tbody>
                    </table>}
            </div>
        </>
    )
}
/**<select name = "member type" id = "membertype">
                                <option value = "0">Apprentice</option>
                                <option value = "0">Member</option>
                                <option value = "1">Officer</option>
                            </select> */

export default Panel;