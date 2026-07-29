function ResultCard() {

    return (

        <div className="card">

            <h2>Prediction</h2>

            <h1>😊 Happy</h1>

            <p>

                Confidence

            </p>

            <progress

                value="96"

                max="100"

            ></progress>

            <h3>96%</h3>

        </div>

    );

}

export default ResultCard;