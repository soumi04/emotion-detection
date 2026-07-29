function UploadCard() {

    return (

        <div className="card">

            <h2>Upload Image</h2>

            <input

                type="file"

                accept="image/*"

            />

            <button>

                Predict Emotion

            </button>

        </div>

    );

}

export default UploadCard;