import React, {Component} from "react"

import QuizQuestionButton from "./QuizQuestionButton"

class QuizQuestion extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
      }

    handleClick(buttonText) {
        // console.log("handleClick(buttonText)!!!")
        if (buttonText === this.props.quiz_question.answer) {
            //console.log("handleClick(buttonText)!!!")
            //console.log("QUiz question: ", this.props.quiz_question)
            this.props.showNextQuestionHandler()
        }
    }

    render() {
        // console.log("Quiz position:", this.props.position)
        // console.log("Props in QuizQuestion: ", this.props)
        return (
            <main>
                <section>
                <p>{this.props.quiz_question.instruction_text}</p>
                </section>
                <section className="buttons">
                <ul>
                    {
                        this.props.quiz_question.answer_options.map((item, index) =>
                            <QuizQuestionButton 
                                key={index} 
                                button_text={item}
                                clickHandler={this.handleClick} />
                        )
                    }
                </ul>
                </section>
            </main>
        )
    }
}

export default QuizQuestion