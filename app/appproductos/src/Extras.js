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


