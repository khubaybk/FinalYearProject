import React from 'react';
import './NewPost.css';
import './PostForm.css';
import'./lockOut.css';




const lockOut = () => {
    return (
        <React.Fragment>
            <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: 'white' }}>You have used your alloted time period. Come back tomorrow or below are activities that can help your wellbeing! </h1>

            <div style={parentSplit}>


                <div className="card-1" style={{marginLeft: '300px'}}>
                    <img src={"https://en.pimg.jp/077/304/451/1/77304451.jpg"}
                         alt={"read a book"} className="card--image" />
                    <div className="card--content">
                        <h2 className="card--title">{"Practice Mindfulness for a Calmer Mind"}</h2>
                        <p className="card--description">{"Learn the art of mindfulness and meditation to reduce stress, increase self-awareness, and improve focus."}</p>
                    </div>
                </div>

                <div className="card-1" style={{marginLeft: '200px'}}>
                    <img src={"https://static.vecteezy.com/system/resources/thumbnails/008/017/927/small/illustration-of-people-running-icon-flat-design-free-vector.jpg"}
                         alt={"read a book"} className="card--image" />
                    <div className="card--content">
                        <h2 className="card--title">{"Get Moving! Exercise"}</h2>
                        <p className="card--description">{"Regular exercise helps to increase endorphins, reduce stress, and improve mood. Incorporate physical activity for better mental wellbeing."
                        } </p>
                    </div>
                </div>

                <div className="card-1" style={{marginLeft: '300px'}}>
                    <img src={"https://thumbs.dreamstime.com/b/stick-figure-as-cook-vegetables-good-meal-88216833.jpg"}
                         alt={"read a book"} className="card--image" />
                    <div className="card--content">
                        <h2 className="card--title">{"Healthy body, Healthy mind!"}</h2>
                        <p className="card--description">{"Fuel your body and mind with a balanced diet rich in nutrients. Eat whole foods, avoid processed foods.\n" +
                            "\n"}</p>
                    </div>
                </div>

                <div className="card-1" style={{marginLeft: '200px'}}>
                    <img src={"https://c8.alamy.com/comp/RJDWY5/stickman-thinking-positive-during-an-attack-of-negeative-thoughts-RJDWY5.jpg"}
                         alt={"read a book"} className="card--image" />
                    <div className="card--content">
                        <h2 className="card--title">{"Positive thinking! "}</h2>
                        <p className="card--description">{" Practice gratitude and positive thinking to improve mental wellbeing. Focus on the good in your life and let go of negative thoughts to create a more positive outlook."}</p>
                    </div>
                </div>

                <div className="card-1" style={{marginLeft: '300px'}}>
                    <img src={"https://media.istockphoto.com/id/859583770/vector/man-or-boy-reading-a-book.jpg?s=612x612&w=0&k=20&c=I3U3ote151MHluXfTORlEVPTmBofED4a5CjUWh9r8mg="}
                         alt={"read a book"} className="card--image" />
                    <div className="card--content">
                        <h2 className="card--title">{" Set Goals!"}</h2>
                        <p className="card--description">{"Create structure and set goals to improve productivity and boost confidence. Achieving goals and staying organized can help reduce stress and increase feelings of accomplishment."}</p>
                    </div>
                </div>

                <div className="card-1" style={{marginLeft: '200px'}}>
                    <img src={"https://img.freepik.com/free-vector/hand-drawn-stickman-collection_23-2149217627.jpg"}
                         alt={"read a book"} className="card--image" />
                    <div className="card--content">
                        <h2 className="card--title">{"Connect with Others!"}</h2>
                        <p className="card--description">{"tay connected with friends and family to build a strong social support system. A sense of belonging and connection can help reduce stress and boost mental wellbeing."}</p>
                    </div>
                </div>




            </div>
        </React.Fragment>
    );
};
const parentSplit = {'display':'grid', gridTemplateColumns: '50% 50%'}


const style = {'margin-left': '20px', 'border-style':'solid', 'margin-right': '20px' };
export default lockOut;
