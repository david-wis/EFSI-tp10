import React from 'react';

export const ImgUploader = ({img64, handleImageChange}) => {
    return (
        <div>
            <img style={{display: "block"}} width="100" height="100" alt="Foto no encontrada" src={"data:image/jpeg;base64,"+img64}></img>
            <input style={{display: "block"}} type="file" onChange={handleImageChange} accept='.jpg'/>
        </div>
    );
}

export const Botoncitos= ({nuevo, agregarProducto, eliminarClick}) => {
    return (
            <div>
                {nuevo ? 
                    <a onMouseDown={agregarProducto}>
                        <i className="material-icons" data-toggle="tooltip" title="OK">done</i>
                    </a> : null
                }
                <i onClick={eliminarClick} className="material-icons" data-toggle="tooltip" title="Eliminar">&#xE872;</i>
            </div>
    );
}

export const setEndOfContenteditable = (contentEditableElement) => {
    let range, selection;
    if(document.createRange)
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
}


