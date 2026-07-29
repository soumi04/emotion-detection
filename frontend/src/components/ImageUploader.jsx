import { useState } from "react";

function ImageUploader() {

    const [image, setImage] = useState(null);

    function handleImage(event) {

        const file = event.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }

    }

    return (

        <div className="upload-card">

            <input

                type="file"

                accept="image/*"

                onChange={handleImage}

            />

            {
                image && (

                    <div>

                        <h3>Preview</h3>

                        <img
                            src={image}
                            alt="preview"
                            className="preview-image"
                        />

                    </div>

                )
            }

        </div>

    );

}

export default ImageUploader;