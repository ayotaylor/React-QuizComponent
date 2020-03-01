import React, {Component} from "react"

import QuizQuestion from "./QuizQuestion"
import QuizEnd from "./QuizEnd"

let quizData = require("./quiz_data.json")

class Quiz extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quiz_position : 1
        }
        this.showNextQuestion = this.showNextQuestion.bind(this)
    }

    // componentDidMount() {
    //     console.log("Mounted")
    //     setInterval(this.inc, 10000)
    //   }

    //   componentDidUpdate() {
    //     //console.log("Updated")
    //     setInterval(this.inc, 10000)
    //     // this.setState(prevState => ({
    //     //     quiz_position : prevState + 1
    //     // }))
    //   }

    showNextQuestion() {
        //console.log("Now in showNextQuestion, quiz_position:", this.state.quiz_position)
        //console.log("Quiz question in showNextQuestion: ", quizData.quiz_questions[this.state.quiz_position-1])
        const newPosition = this.state.quiz_position + 1
        this.setState({quiz_position : newPosition})
        // this.setState((prevState) => {
        //     return {
        //         quiz_position : prevState + 1
        //     }
        // })  // doesn't work for some reason. figure this out
    }

    render() {
        //console.log("State altered to, quiz_position:", this.state)
        const isQuizEnd = this.state.quiz_position - 1 === quizData.quiz_questions.length
        
        return (
            isQuizEnd ? 
                <QuizEnd /> : 
                <QuizQuestion 
                position={this.state.quiz_position}
                quiz_question={quizData.quiz_questions[this.state.quiz_position-1]}
                showNextQuestionHandler={this.showNextQuestion} />
        )
    }
}

export default Quiz